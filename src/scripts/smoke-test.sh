#!/bin/bash
# KILIMO Smoke Tests
# Quick validation that critical endpoints are working after deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔥 Running Smoke Tests...${NC}\n"

# Load environment
if [ ! -f ".env" ]; then
  echo -e "${RED}❌ .env file not found${NC}"
  exit 1
fi

export $(grep -v '^#' .env | xargs)

BASE_URL="${API_BASE_URL:-https://your-project.supabase.co/functions/v1/make-server-ce1844e7}"

# Test endpoints
declare -A TESTS=(
  ["Health Check"]="$BASE_URL/health|GET|200"
  ["Wallet Endpoint"]="$BASE_URL/wallet/test-user|GET|200,401"
  ["Market Prices"]="$BASE_URL/market-prices/Morogoro|GET|200"
  ["Weather Data"]="$BASE_URL/weather/Morogoro|GET|200"
)

PASSED=0
FAILED=0

for TEST_NAME in "${!TESTS[@]}"; do
  IFS='|' read -r URL METHOD EXPECTED_CODES <<< "${TESTS[$TEST_NAME]}"
  
  if [ "$METHOD" == "GET" ]; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" 2>&1)
  else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X $METHOD "$URL" 2>&1)
  fi
  
  if [[ $EXPECTED_CODES == *"$RESPONSE"* ]]; then
    echo -e "  ${GREEN}✅${NC} $TEST_NAME: $RESPONSE"
    ((PASSED++))
  else
    echo -e "  ${RED}❌${NC} $TEST_NAME: $RESPONSE (expected: $EXPECTED_CODES)"
    ((FAILED++))
  fi
done

echo ""
echo -e "${YELLOW}Summary:${NC}"
echo -e "  Passed: ${GREEN}$PASSED${NC}"
echo -e "  Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✅ All smoke tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}❌ Some smoke tests failed!${NC}"
  exit 1
fi
