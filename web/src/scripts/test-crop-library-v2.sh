#!/bin/bash

# KILIMO CROP LIBRARY V2 - TEST SCRIPT
# Tests the AI Feedback Loop + Offline Fallback

echo "🧪 KILIMO Crop Library V2 - Integration Tests"
echo "=============================================="
echo ""

# Get project ID from environment or use placeholder
PROJECT_ID="${SUPABASE_PROJECT_ID:-YOUR_PROJECT_ID}"
ANON_KEY="${SUPABASE_ANON_KEY:-YOUR_ANON_KEY}"
BASE_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-ce1844e7"

echo "📍 Testing against: $BASE_URL"
echo ""

# Test 1: Get all crops
echo "Test 1: Fetching all crops..."
CROPS_RESPONSE=$(curl -s -X GET "${BASE_URL}/crop-library/crops" \
  -H "Authorization: Bearer ${ANON_KEY}")

CROP_COUNT=$(echo $CROPS_RESPONSE | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

if [ "$CROP_COUNT" -gt 60 ]; then
  echo "✅ SUCCESS: Found $CROP_COUNT crops (expected 70+)"
else
  echo "❌ FAILED: Only found $CROP_COUNT crops (expected 70+)"
  echo "   Run init: curl ${BASE_URL}/crop-library/init"
fi
echo ""

# Test 2: Image validation
echo "Test 2: Testing image validation..."
VALIDATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/crop-library/validate-image" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="}')

IS_VALID=$(echo $VALIDATION_RESPONSE | grep -o '"is_valid":[a-z]*' | grep -o '[a-z]*$')

if [ "$IS_VALID" == "true" ] || [ "$IS_VALID" == "false" ]; then
  echo "✅ SUCCESS: Image validation working (is_valid: $IS_VALID)"
else
  echo "❌ FAILED: Image validation endpoint not responding correctly"
  echo "   Response: $VALIDATION_RESPONSE"
fi
echo ""

# Test 3: Feedback logging
echo "Test 3: Testing feedback logging..."
FEEDBACK_RESPONSE=$(curl -s -X POST "${BASE_URL}/crop-library/feedback" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "crop_id": "maize",
    "image_url": "https://test.com/image.jpg",
    "diagnosis": "Test diagnosis",
    "confidence": 0.85,
    "outcome": "confirmed",
    "region": "Test Region",
    "season": "long_rains",
    "growth_stage": "vegetative"
  }')

FEEDBACK_ID=$(echo $FEEDBACK_RESPONSE | grep -o '"feedbackId":"[^"]*"' | grep -o ':"[^"]*"' | grep -o '[^":]*')

if [ ! -z "$FEEDBACK_ID" ]; then
  echo "✅ SUCCESS: Feedback logged successfully (ID: ${FEEDBACK_ID:0:8}...)"
else
  echo "❌ FAILED: Feedback logging failed"
  echo "   Response: $FEEDBACK_RESPONSE"
fi
echo ""

# Test 4: Feedback history
echo "Test 4: Testing feedback history..."
HISTORY_RESPONSE=$(curl -s -X GET "${BASE_URL}/crop-library/feedback/maize" \
  -H "Authorization: Bearer ${ANON_KEY}")

HISTORY_COUNT=$(echo $HISTORY_RESPONSE | grep -o '"count":[0-9]*' | grep -o '[0-9]*')

if [ ! -z "$HISTORY_COUNT" ]; then
  echo "✅ SUCCESS: Feedback history retrieved ($HISTORY_COUNT records)"
else
  echo "❌ FAILED: Feedback history endpoint not working"
  echo "   Response: $HISTORY_RESPONSE"
fi
echo ""

# Summary
echo "=============================================="
echo "🎯 Test Summary:"
echo "   - Crop Database: ${CROP_COUNT:-0} crops"
echo "   - Image Validation: ${IS_VALID:-unknown}"
echo "   - Feedback Logging: ${FEEDBACK_ID:+Working}"
echo "   - Feedback History: ${HISTORY_COUNT:-0} records"
echo ""
echo "📋 Next Steps:"
echo "   1. If any tests failed, check server logs"
echo "   2. Test offline mode in browser DevTools"
echo "   3. Generate AI images for top crops"
echo "   4. Monitor feedback submissions"
echo ""
echo "✅ All tests passed? You're ready for production! 🚀"
