#!/bin/bash

# Fake News Detection System - Quick Test Script
echo "🕵️ Fake News Detection System - Quick Test"
echo "=========================================="
echo ""

# Test Live ML Service Health
echo "🔍 Testing Live ML Service Health..."
curl -s https://fakenewsdetection-927d.onrender.com/health | jq '.' 2>/dev/null || curl -s https://fakenewsdetection-927d.onrender.com/health
echo ""
echo ""

# Test Local Backend Health
echo "🔍 Testing Local Backend Health..."
curl -s http://localhost:5000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:5000/api/health
echo ""
echo ""

# Test Real News Example via Backend
echo "📰 Testing REAL News Example via Backend..."
curl -s -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"The Federal Reserve announced a 0.25% interest rate increase following their monthly meeting. Federal Reserve Chair Jerome Powell cited inflation concerns and strong employment data as key factors in the decision."}' | jq '.' 2>/dev/null || curl -s -X POST http://localhost:5000/api/predict -H "Content-Type: application/json" -d '{"text":"The Federal Reserve announced a 0.25% interest rate increase following their monthly meeting."}'
echo ""
echo ""

# Test Fake News Example via Backend
echo "⚠️ Testing FAKE News Example..."
curl -s -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"SHOCKING: Doctors HATE this one simple trick that cures diabetes in 30 days! This ancient remedy from Tibet has been hidden from the public for centuries!"}' | jq '.' 2>/dev/null || curl -s -X POST http://localhost:5000/api/predict -H "Content-Type: application/json" -d '{"text":"SHOCKING: Doctors HATE this one simple trick that cures diabetes in 30 days!"}'
echo ""
echo ""

echo "✅ Test Complete!"
echo ""
echo "🌐 Frontend: http://localhost:3002"
echo "🔧 Backend API: http://localhost:5000/api"
echo "📝 Examples: Check example.txt for more test cases"
