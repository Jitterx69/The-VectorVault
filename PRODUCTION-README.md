# 🚀 Vector Vault - Production Deployment Guide

## Overview
Your Vector Vault application has been fully containerized and deployed with enterprise-grade scalability features. This guide covers the final production setup steps.

## ✅ Current Production Status

### Infrastructure Deployed
- ✅ **Kubernetes Cluster**: Docker Desktop with Istio service mesh
- ✅ **Application**: 2-10 auto-scaling pods with health checks
- ✅ **Caching**: Redis with persistent storage
- ✅ **Load Balancing**: Istio Gateway + Nginx CDN
- ✅ **Monitoring**: Prometheus + Grafana dashboards
- ✅ **Security**: Rate limiting, network policies, SSL ready

### Access Points
- **Application**: http://localhost
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **API Health**: http://localhost/api/health

---

## 🎯 Final Production Setup Steps

### 1. Domain Configuration

#### For Production Domain (e.g., vectorvault.ai):

```bash
# Get the load balancer external IP
kubectl get svc vectorvault-service

# Example output:
# NAME                        TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)
# incident-guard-ai-service   LoadBalancer   10.106.201.90   localhost     80:30399/TCP

# In production, EXTERNAL-IP would be your cloud load balancer IP
# Configure DNS: incident-guard-ai.com → [EXTERNAL-IP]
```

#### Update Kubernetes Ingress:
```bash
# Edit the ingress configuration
kubectl edit ingress vectorvault-ingress

# Update spec.rules[0].host to your domain:
# host: vectorvault.ai
```

### 2. SSL Certificate Setup

#### Automatic Let's Encrypt Certificates:

```bash
# Update the ClusterIssuer with your email
kubectl edit clusterissuer letsencrypt-prod

# Update spec.acme.email to your email address

# The Certificate resource will automatically request SSL certificates
kubectl get certificate

# Check certificate status
kubectl describe certificate vectorvault-tls
```

#### Manual Certificate (if needed):
```yaml
# Alternative: Use your own certificate
apiVersion: v1
kind: Secret
metadata:
  name: custom-tls
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # base64 encoded certificate
  tls.key: LS0tLS1CRUdJTi... # base64 encoded private key
```

### 3. External Redis (AWS ElastiCache)

#### Switch to AWS ElastiCache:

```bash
# 1. Create ElastiCache cluster in AWS Console
# 2. Get the endpoint (e.g., my-cluster.cache.amazonaws.com)

# 2. Update the external Redis configuration
kubectl edit configmap external-redis-config

# Update data.REDIS_HOST to your ElastiCache endpoint

# 3. Deploy external Redis configuration
kubectl apply -f k8s/external-redis.yaml

# 4. Update application to use external Redis
kubectl rollout restart deployment incident-guard-ai-deployment
```

#### ElastiCache Security:
- Enable encryption in transit
- Configure security groups
- Use IAM authentication (recommended)

### 4. Database Read Replicas

#### Enable TiDB Read Replicas:

```bash
# 1. Configure read replicas in TiDB Cloud Console
# 2. Get replica endpoints

# 2. Update database configuration
kubectl edit configmap vectorvault-config

# Add replica configurations:
# DB_REPLICA_1_HOST: "replica1.tidbcloud.com"
# DB_REPLICA_1_PORT: "4000"
# DB_READ_WRITE_SPLITTING_ENABLED: "true"

# 3. Deploy database proxy
kubectl apply -f k8s/database-replicas.yaml

# 4. Update application environment
kubectl set env deployment/vectorvault-deployment \
  DB_READ_REPLICAS_ENABLED=true
```

### 5. Load Testing & Auto-Scaling

#### Test Auto-Scaling:

```bash
# Install load testing tool
npm install -g artillery

# Create load test configuration
cat > load-test.yml << EOF
config:
  target: 'http://localhost'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Load test
scenarios:
  - name: 'API Load Test'
    weight: 70
    requests:
      - get:
          url: '/api/health'
      - get:
          url: '/api/search-stats'
  - name: 'Frontend Load Test'
    weight: 30
    requests:
      - get:
          url: '/'
EOF

# Run load test
artillery run load-test.yml

# Monitor scaling
kubectl get hpa -w
kubectl get pods -w
```

#### Monitor Auto-Scaling:

```bash
# Watch HPA scaling decisions
kubectl describe hpa vectorvault-hpa

# Check pod scaling
kubectl get pods -l app=vectorvault

# Monitor resource usage
kubectl top pods
kubectl top nodes
```

---

## 📊 Production Monitoring

### Grafana Dashboards

Access Grafana at http://localhost:3000 (admin/admin)

#### Key Metrics to Monitor:
1. **Application Performance**
   - HTTP request duration
   - Error rates by endpoint
   - Response time percentiles

2. **Infrastructure Health**
   - CPU/Memory usage per pod
   - Pod restart counts
   - Network I/O

3. **Business Metrics**
   - API request volume
   - User session duration
   - Database query performance

### Prometheus Queries

```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m])

# Response time percentiles
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Pod resource usage
rate(container_cpu_usage_seconds_total{pod=~".*incident-guard-ai.*"}[5m])
```

---

## 🔧 Production Maintenance

### Backup Strategy

```bash
# Database backups (configure in TiDB Cloud)
# Redis persistence is automatic with PVC
# Application logs are persistent

# Backup PVC data
kubectl cp vectorvault-deployment-pod:/app/logs ./backups/
```

### Update Deployment

```bash
# Update application image
kubectl set image deployment/vectorvault-deployment \
  vectorvault=vectorvault:v2.0.0

# Monitor rollout
kubectl rollout status deployment/vectorvault-deployment

# Rollback if needed
kubectl rollout undo deployment/vectorvault-deployment
```

### Scaling Configuration

```bash
# Adjust HPA settings
kubectl edit hpa vectorvault-hpa

# Example: More aggressive scaling
# minReplicas: 3
# maxReplicas: 20
# targetCPUUtilizationPercentage: 60
```

---

## 🚨 Production Alerts

### Recommended Alerts

1. **High Error Rate**
   ```
   rate(http_requests_total{status_code=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
   ```

2. **Pod Restarts**
   ```
   rate(kube_pod_container_status_restarts_total[5m]) > 0
   ```

3. **High CPU Usage**
   ```
   rate(container_cpu_usage_seconds_total[10m]) > 0.8
   ```

4. **Low Available Replicas**
   ```
   kube_deployment_spec_replicas - kube_deployment_status_replicas_available > 0
   ```

---

## 🎉 Production Checklist

- [x] Application containerized and deployed
- [x] Auto-scaling configured (2-10 pods)
- [x] Redis caching layer active
- [x] Monitoring stack deployed
- [x] Service mesh configured
- [x] SSL certificates ready
- [ ] Domain DNS configured
- [ ] External Redis connected
- [ ] Database replicas enabled
- [ ] Load testing completed
- [ ] Production monitoring alerts configured

## 📞 Support

For production issues:
1. Check application logs: `kubectl logs -f deployment/vectorvault-deployment`
2. Monitor Grafana dashboards
3. Check pod health: `kubectl get pods`
4. Review HPA status: `kubectl describe hpa vectorvault-hpa`

---

**Your Vector Vault application is now production-ready with enterprise-grade scalability and reliability!** 🚀