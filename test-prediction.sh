#!/bin/bash

echo "🧪 Testing ML Prediction API Integration..."
echo ""

# Test the prediction endpoint
echo "📡 Making prediction request with input [1, 0, 0]..."
echo ""

curl -X POST http://localhost:3001/api/predict-attack \
  -H "Content-Type: application/json" \
  -d '{
    "part1": "1",
    "part2": "0",
    "part3": "0"
  }' | json_pp

echo ""
echo "✅ Test complete!"
echo ""
echo "Expected output:"
echo "- success: true"
echo "- prediction.attackName: 'Distributed Denial of Service (DDoS)'"
echo "- prediction.confidence: 0.95"
echo "- prediction.foundInDatabase: (true/false depending on your database)"
