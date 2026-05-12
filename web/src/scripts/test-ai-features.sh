#!/bin/bash

# ============================================================================
# KILIMO AI Feature Integration - Test Script
# ============================================================================
# Tests all 10 AI features to ensure they work correctly
# ============================================================================

echo "🧪 KILIMO AI Feature Integration Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: jq not installed. Install with: brew install jq${NC}"
    echo ""
fi

# Get project ID from environment or ask user
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "Enter your Supabase Project ID:"
    read PROJECT_ID
else
    PROJECT_ID=$SUPABASE_PROJECT_ID
fi

# Get anon key
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Enter your Supabase Anon Key:"
    read ANON_KEY
else
    ANON_KEY=$SUPABASE_ANON_KEY
fi

API_URL="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-ce1844e7/ai/engine"

echo -e "${GREEN}Testing AI Engine at: $API_URL${NC}"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Helper function to test a feature
test_feature() {
    local feature_name=$1
    local feature_key=$2
    local context=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${YELLOW}[$TOTAL_TESTS] Testing: $feature_name${NC}"
    
    # Make API call
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ANON_KEY" \
        -d "{
            \"role\": \"smallholder_farmer\",
            \"feature\": \"$feature_key\",
            \"language\": \"EN\",
            \"context\": $context,
            \"query\": \"\"
        }")
    
    # Check if response contains "success": true
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ PASS: $feature_name${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL: $feature_name${NC}"
        echo "Response: $response"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    echo ""
}

# ============================================================================
# TEST 1: Crop Intelligence
# ============================================================================
test_feature \
    "Crop Intelligence" \
    "crop_intelligence" \
    '{
        "crop_name": "Maize",
        "variety": "Hybrid",
        "region": "Arusha",
        "season": "Long rains"
    }'

# ============================================================================
# TEST 2: Farming Templates
# ============================================================================
test_feature \
    "Farming Templates" \
    "farming_templates" \
    '{
        "crop": "Maize",
        "practice_type": "rainfed",
        "soil_type": "Sandy loam",
        "inputs_available": ["DAP", "Urea"],
        "labor_level": "medium"
    }'

# ============================================================================
# TEST 3: Crop Planning
# ============================================================================
test_feature \
    "Crop Planning" \
    "crop_planning" \
    '{
        "plots": [
            {"name": "Plot A", "size_acres": 2.5}
        ],
        "selected_template": "Rainfed Maize",
        "season_window": "March-July 2026",
        "goal": "yield"
    }'

# ============================================================================
# TEST 4: Yield & Revenue Forecasting
# ============================================================================
test_feature \
    "Yield & Revenue Forecasting" \
    "yield_revenue" \
    '{
        "crop_plan": [
            {"crop": "Maize", "acres": 2.5}
        ],
        "market_prices": {
            "Maize": 800
        },
        "confidence_preference": "balanced"
    }'

# ============================================================================
# TEST 5: Inventory Management
# ============================================================================
test_feature \
    "Inventory Management" \
    "inventory" \
    '{
        "harvested_amount": 2200,
        "planned_amount": 2500,
        "current_stock": {
            "Maize bags": 44
        }
    }'

# ============================================================================
# TEST 6: Marketplace Pricing
# ============================================================================
test_feature \
    "Marketplace Pricing" \
    "marketplace" \
    '{
        "inventory": [
            {"product": "Maize", "quantity": 2200, "quality": "Grade A"}
        ],
        "price_preferences": "market average",
        "sales_channels": ["Local market"]
    }'

# ============================================================================
# TEST 7: Finance Management
# ============================================================================
test_feature \
    "Finance Management" \
    "finance" \
    '{
        "transactions": [
            {"date": "2026-01-15", "type": "income", "amount": 500000, "category": "Maize sale"}
        ],
        "wallet_balance": 450000,
        "pending_payments": 100000
    }'

# ============================================================================
# TEST 8: Livestock Management
# ============================================================================
test_feature \
    "Livestock Management" \
    "livestock" \
    '{
        "animal_type": "Dairy cow",
        "symptoms": ["Reduced milk production"],
        "environment": "Zero grazing"
    }'

# ============================================================================
# TEST 9: Unified AI Advisor
# ============================================================================
test_feature \
    "Unified AI Advisor" \
    "unified_advisor" \
    '{
        "recent_activity": ["Planted maize in Plot A"],
        "weather": {
            "condition": "Sunny",
            "temperature": 28,
            "rainfall": 0
        },
        "market_trends": ["Maize prices rising"]
    }'

# ============================================================================
# TEST 10: Weather-Based Advice
# ============================================================================
test_feature \
    "Weather-Based Advice" \
    "weather_advice" \
    '{
        "weather_forecast": [
            {"date": "2026-02-11", "condition": "Heavy rain", "rainfall": 45}
        ],
        "current_crops": ["Maize"],
        "upcoming_tasks": ["Weeding"]
    }'

# ============================================================================
# SUMMARY
# ============================================================================
echo "======================================"
echo "📊 Test Summary"
echo "======================================"
echo -e "Total Tests:  $TOTAL_TESTS"
echo -e "${GREEN}Passed:       $PASSED_TESTS${NC}"
echo -e "${RED}Failed:       $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! AI system is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please check the errors above.${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Check if OPENROUTER_API_KEY is configured in Supabase Edge Functions"
    echo "2. Verify the project ID and anon key are correct"
    echo "3. Check if the server is deployed: sh deploy-kilimo.sh"
    exit 1
fi
