#!/bin/bash

# Production Deployment Script for Incident Guard AI
# This script configures the application for production deployment

echo "🚀 Starting Production Deployment for Incident Guard AI"

# Check prerequisites
echo "📋 Checking prerequisites..."
kubectl version --short >/dev/null 2>&1 || { echo "❌ kubectl not found. Please install kubectl."; exit 1; }
echo "✅ kubectl found"

# 1. Configure Domain
echo "🌐 Step 1: Configure Domain"
read -p "Enter your domain name (e.g., incident-guard-ai.com): " DOMAIN
read -p "Enter your email for SSL certificates: " EMAIL

# Update Ingress with domain
sed -i "s/your-domain.com/$DOMAIN/g" k8s/cdn-ingress.yaml
sed -i "s/your-email@example.com/$EMAIL/g" k8s/cert-issuer.yaml
sed -i "s/your-domain.com/$DOMAIN/g" k8s/cert-issuer.yaml

echo "✅ Domain configured: $DOMAIN"

# 2. Configure External Redis (AWS ElastiCache)
echo "💾 Step 2: Configure External Redis"
read -p "Enter your AWS ElastiCache endpoint (leave empty to use internal Redis): " REDIS_ENDPOINT

if [ ! -z "$REDIS_ENDPOINT" ]; then
    sed -i "s/your-elasticache-endpoint.cache.amazonaws.com/$REDIS_ENDPOINT/g" k8s/external-redis.yaml
    kubectl apply -f k8s/external-redis.yaml
    echo "✅ External Redis configured: $REDIS_ENDPOINT"
else
    echo "ℹ️  Using internal Redis deployment"
fi

# 3. Deploy cert-manager and SSL certificates
echo "🔒 Step 3: Deploy SSL certificates"
kubectl apply -f k8s/cert-issuer.yaml
echo "⏳ Waiting for cert-manager to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
echo "✅ SSL certificates configured"

# 4. Deploy all components
echo "📦 Step 4: Deploy all components"
kubectl apply -f k8s/persistent-volume.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/monitoring.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/cdn-ingress.yaml
kubectl apply -f k8s/istio-gateway.yaml

# 5. Wait for deployments to be ready
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/incident-guard-ai-deployment
kubectl wait --for=condition=available --timeout=300s deployment/redis-deployment
kubectl wait --for=condition=available --timeout=300s deployment/nginx-cdn

# 6. Configure TiDB read replicas (if available)
echo "🗄️  Step 6: Configure TiDB read replicas"
read -p "Do you have TiDB read replicas available? (y/n): " HAS_REPLICAS

if [ "$HAS_REPLICAS" = "y" ]; then
    echo "📝 Please update k8s/database-replicas.yaml with your replica endpoints"
    echo "📝 Then run: kubectl apply -f k8s/database-replicas.yaml"
else
    echo "ℹ️  Skipping database read replicas configuration"
fi

# 7. Verify deployment
echo "🔍 Step 7: Verify deployment"
echo "📊 Checking pod status..."
kubectl get pods
echo ""
echo "🌐 Checking services..."
kubectl get services
echo ""
echo "📈 Checking HPA..."
kubectl get hpa

echo ""
echo "🎉 Production deployment completed!"
echo ""
echo "🌐 Your application is available at: https://$DOMAIN"
echo "📊 Grafana dashboard: kubectl port-forward svc/grafana-service -n monitoring 3000:3000"
echo "📈 Prometheus metrics: kubectl port-forward svc/prometheus-service -n monitoring 9090:9090"
echo "🔍 Application logs: kubectl logs -f deployment/incident-guard-ai-deployment"
echo ""
echo "⚠️  Important: Update your DNS to point $DOMAIN to your load balancer IP"
echo "🔒 SSL certificates will be automatically provisioned by cert-manager"