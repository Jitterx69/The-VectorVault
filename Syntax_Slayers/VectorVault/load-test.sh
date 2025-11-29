#!/bin/bash

# Load Testing Script for Incident Guard AI
# Demonstrates auto-scaling capabilities

echo "🚀 Starting Load Test for Incident Guard AI Auto-Scaling"

# Function to make concurrent requests
load_test() {
    local duration=$1
    local concurrency=$2
    local endpoint=$3

    echo "📊 Testing $endpoint with $concurrency concurrent requests for ${duration}s"

    # Use curl with parallel requests
    for i in $(seq 1 $concurrency); do
        curl -s "$endpoint" > /dev/null &
    done

    # Wait for test duration
    sleep $duration

    # Kill background curl processes
    pkill -f "curl.*$endpoint"
    wait 2>/dev/null
}

# Monitor function
monitor_scaling() {
    echo "📈 Monitoring auto-scaling..."
    echo "Current HPA status:"
    kubectl get hpa incident-guard-ai-hpa

    echo ""
    echo "Pod status:"
    kubectl get pods -l app=incident-guard-ai

    echo ""
    echo "Resource usage:"
    kubectl top pods 2>/dev/null || echo "kubectl top not available - install metrics-server for detailed metrics"
}

echo "📊 Pre-test status:"
monitor_scaling

echo ""
echo "🧪 Phase 1: Light Load (30 seconds)"
load_test 30 5 "http://localhost/api/health"

echo ""
echo "📊 After Phase 1:"
monitor_scaling

echo ""
echo "🧪 Phase 2: Medium Load (45 seconds)"
load_test 45 15 "http://localhost/api/health"

echo ""
echo "📊 After Phase 2:"
monitor_scaling

echo ""
echo "🧪 Phase 3: Heavy Load (60 seconds)"
load_test 60 30 "http://localhost/api/health"

echo ""
echo "📊 Final status:"
monitor_scaling

echo ""
echo "✅ Load testing complete!"
echo ""
echo "🔍 Check Grafana dashboards to see detailed metrics:"
echo "   - http://localhost:3000 (admin/admin)"
echo ""
echo "📊 Key metrics to observe:"
echo "   - Pod count changes (should scale from 2 to higher)"
echo "   - CPU/Memory usage spikes"
echo "   - Request rate increases"
echo "   - Response time changes"
