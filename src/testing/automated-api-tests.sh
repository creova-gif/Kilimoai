#!/bin/bash

################################################################################
# KILIMO AUTOMATED API TESTING SCRIPT
# Tests critical backend endpoints for production readiness
# Usage: ./testing/automated-api-tests.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="${API_BASE:-https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7}"
ANON_KEY="${ANON_KEY:-YOUR_SUPABASE_ANON_KEY}"
TEST_PHONE="${TEST_PHONE:-+255712345678}"
TEST_PASSWORD="TestPass123!"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Print functions
print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_test() {
    echo -e "${YELLOW}▶ TEST: $1${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ PASS: $1${NC}"
    ((TESTS_PASSED++))
}

print_fail() {
    echo -e "${RED}✗ FAIL: $1${NC}"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${BLUE}ℹ INFO: $1${NC}"
}

# Test function wrapper
run_test() {
    ((TESTS_RUN++))
}

# Check prerequisites
check_prerequisites() {
    print_header "CHECKING PREREQUISITES"
    
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}ERROR: curl is not installed${NC}"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}WARNING: jq is not installed. JSON parsing will be limited.${NC}"
        echo -e "${YELLOW}Install with: brew install jq (macOS) or apt-get install jq (Linux)${NC}"
    fi
    
    if [ "$API_BASE" == "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7" ]; then
        echo -e "${RED}ERROR: Please set API_BASE environment variable${NC}"
        echo -e "${YELLOW}Example: export API_BASE=https://your-project.supabase.co/functions/v1/make-server-ce1844e7${NC}"
        exit 1
    fi
    
    if [ "$ANON_KEY" == "YOUR_SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}ERROR: Please set ANON_KEY environment variable${NC}"
        echo -e "${YELLOW}Example: export ANON_KEY=your_anon_key${NC}"
        exit 1
    fi
    
    print_pass "All prerequisites met"
}

################################################################################
# TEST 1: Health Check
################################################################################
test_health_check() {
    run_test
    print_test "Health Check"
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/health" \
        -H "Authorization: Bearer $ANON_KEY")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        print_pass "Health check endpoint responding (HTTP $http_code)"
        print_info "Response: $body"
    else
        print_fail "Health check failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 2: Signup (WITHOUT auto-confirm)
################################################################################
test_signup() {
    run_test
    print_test "User Signup (OTP Required)"
    
    # Generate unique phone for testing
    TIMESTAMP=$(date +%s)
    TEST_PHONE_UNIQUE="+255${TIMESTAMP:(-9)}"
    
    print_info "Testing with phone: $TEST_PHONE_UNIQUE"
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/signup" \
        -X POST \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"role\": \"smallholder_farmer\",
            \"name\": \"Test User $TIMESTAMP\",
            \"phone_number\": \"$TEST_PHONE_UNIQUE\",
            \"password\": \"$TEST_PASSWORD\",
            \"language\": \"en\",
            \"role_specific_fields\": {
                \"farm_size\": 2.5,
                \"crops\": [\"maize\", \"beans\"]
            }
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        if echo "$body" | grep -q '"status":"success"'; then
            USER_ID=$(echo "$body" | jq -r '.user_id' 2>/dev/null || echo "")
            
            if [ -n "$USER_ID" ]; then
                print_pass "Signup successful. User ID: $USER_ID"
                print_info "Next step should be OTP verification"
                
                # Save for subsequent tests
                echo "$USER_ID" > /tmp/kilimo_test_user_id
                echo "$TEST_PHONE_UNIQUE" > /tmp/kilimo_test_phone
            else
                print_fail "Signup succeeded but no user_id returned"
            fi
        else
            print_fail "Signup failed: $body"
        fi
    else
        print_fail "Signup HTTP error (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 3: OTP Verification (Manual)
################################################################################
test_otp_verification() {
    run_test
    print_test "OTP Verification (Requires Manual OTP Entry)"
    
    if [ ! -f /tmp/kilimo_test_user_id ]; then
        print_fail "No user_id from signup. Skipping OTP test."
        return
    fi
    
    USER_ID=$(cat /tmp/kilimo_test_user_id)
    TEST_PHONE_UNIQUE=$(cat /tmp/kilimo_test_phone)
    
    print_info "User ID: $USER_ID"
    print_info "Phone: $TEST_PHONE_UNIQUE"
    print_info ""
    echo -e "${YELLOW}─────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}ACTION REQUIRED: Check SMS on $TEST_PHONE_UNIQUE${NC}"
    echo -e "${YELLOW}Enter the 6-digit OTP code (or 'skip' to skip):${NC}"
    echo -e "${YELLOW}─────────────────────────────────────────────────${NC}"
    read -p "OTP: " OTP_CODE
    
    if [ "$OTP_CODE" == "skip" ] || [ -z "$OTP_CODE" ]; then
        print_info "OTP test skipped"
        return
    fi
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/verify" \
        -X POST \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$USER_ID\",
            \"otp_code\": \"$OTP_CODE\",
            \"method\": \"phone\"
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        if echo "$body" | grep -q '"status":"success"'; then
            print_pass "OTP verification successful"
            print_info "Phone should now be confirmed in Supabase Auth"
            print_info "Wallet should be auto-created"
        else
            print_fail "OTP verification failed: $body"
        fi
    else
        print_fail "OTP verification HTTP error (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 4: Resend OTP
################################################################################
test_resend_otp() {
    run_test
    print_test "Resend OTP"
    
    if [ ! -f /tmp/kilimo_test_user_id ]; then
        print_fail "No user_id from signup. Skipping resend OTP test."
        return
    fi
    
    USER_ID=$(cat /tmp/kilimo_test_user_id)
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/resend-otp" \
        -X POST \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$USER_ID\",
            \"method\": \"phone\"
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        if echo "$body" | grep -q '"status":"success"'; then
            print_pass "Resend OTP successful"
            print_info "New OTP should be sent via SMS"
        else
            print_fail "Resend OTP failed: $body"
        fi
    else
        print_fail "Resend OTP HTTP error (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 5: Verification Status Check
################################################################################
test_verification_status() {
    run_test
    print_test "Verification Status Check"
    
    if [ ! -f /tmp/kilimo_test_user_id ]; then
        print_fail "No user_id from signup. Skipping status check."
        return
    fi
    
    USER_ID=$(cat /tmp/kilimo_test_user_id)
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/verification-status/$USER_ID" \
        -H "Authorization: Bearer $ANON_KEY")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        print_pass "Verification status retrieved"
        print_info "Response: $body"
        
        if echo "$body" | grep -q '"phoneVerified":true'; then
            print_pass "Phone is verified ✓"
        else
            print_info "Phone not yet verified (expected if OTP not entered)"
        fi
    else
        print_fail "Verification status HTTP error (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 6: Invalid OTP (Should Fail)
################################################################################
test_invalid_otp() {
    run_test
    print_test "Invalid OTP (Should Fail)"
    
    if [ ! -f /tmp/kilimo_test_user_id ]; then
        print_fail "No user_id from signup. Skipping invalid OTP test."
        return
    fi
    
    USER_ID=$(cat /tmp/kilimo_test_user_id)
    INVALID_OTP="000000"
    
    response=$(curl -s -w "\n%{http_code}" "$API_BASE/verify" \
        -X POST \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d "{
            \"user_id\": \"$USER_ID\",
            \"otp_code\": \"$INVALID_OTP\",
            \"method\": \"phone\"
        }")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Should fail with 401
    if [ "$http_code" == "401" ] || echo "$body" | grep -q '"status":"error"'; then
        print_pass "Invalid OTP correctly rejected"
        print_info "Response: $body"
    else
        print_fail "Invalid OTP should have been rejected (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

################################################################################
# TEST 7: Wallet Auto-Creation Check
################################################################################
test_wallet_autocreation() {
    run_test
    print_test "Wallet Auto-Creation After Verification"
    
    print_info "This test requires manual verification:"
    print_info "1. Check Supabase KV store for wallet:USER_ID"
    print_info "2. Verify balance = 0 and status = 'active'"
    print_info ""
    echo -e "${YELLOW}Was a wallet auto-created after OTP verification? (y/n/skip):${NC}"
    read -p "Response: " WALLET_CHECK
    
    case "$WALLET_CHECK" in
        y|Y|yes|YES)
            print_pass "Wallet auto-creation confirmed"
            ;;
        n|N|no|NO)
            print_fail "Wallet was NOT auto-created (BLOCKER!)"
            ;;
        *)
            print_info "Wallet test skipped"
            ;;
    esac
}

################################################################################
# TEST 8: SMS Delivery Check
################################################################################
test_sms_delivery() {
    run_test
    print_test "SMS Delivery Check"
    
    print_info "This test requires manual verification:"
    print_info ""
    echo -e "${YELLOW}─────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}Did you receive SMS OTP on $TEST_PHONE? (y/n/skip):${NC}"
    echo -e "${YELLOW}─────────────────────────────────────────────────${NC}"
    read -p "Response: " SMS_CHECK
    
    case "$SMS_CHECK" in
        y|Y|yes|YES)
            print_pass "SMS delivery confirmed"
            print_info "Check delivery time (should be < 30 seconds)"
            ;;
        n|N|no|NO)
            print_fail "SMS NOT received (BLOCKER!)"
            print_info "Possible causes:"
            print_info "  - Africa's Talking credentials not configured"
            print_info "  - Insufficient account credits"
            print_info "  - Wrong phone number format"
            print_info "  - Network/carrier issues"
            ;;
        *)
            print_info "SMS test skipped"
            ;;
    esac
}

################################################################################
# SUMMARY
################################################################################
print_summary() {
    print_header "TEST SUMMARY"
    
    echo -e "Total Tests Run:    ${BLUE}$TESTS_RUN${NC}"
    echo -e "Tests Passed:       ${GREEN}$TESTS_PASSED${NC}"
    echo -e "Tests Failed:       ${RED}$TESTS_FAILED${NC}"
    echo ""
    
    PASS_RATE=$((TESTS_PASSED * 100 / TESTS_RUN))
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ ALL TESTS PASSED! (100%)${NC}"
        echo -e "${GREEN}✓ Backend is production-ready!${NC}"
    elif [ $PASS_RATE -ge 80 ]; then
        echo -e "${YELLOW}⚠ MOST TESTS PASSED ($PASS_RATE%)${NC}"
        echo -e "${YELLOW}⚠ Fix failing tests before production launch${NC}"
    else
        echo -e "${RED}✗ MANY TESTS FAILED ($PASS_RATE%)${NC}"
        echo -e "${RED}✗ NOT ready for production. Fix critical issues.${NC}"
    fi
    
    echo ""
    print_info "For detailed logs, check the output above"
    print_info "For frontend testing, run: npm run test"
}

################################################################################
# MAIN EXECUTION
################################################################################
main() {
    clear
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║        KILIMO AUTOMATED API TESTING SUITE                 ║"
    echo "║        Production Readiness Validation                     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_prerequisites
    
    print_header "RUNNING BACKEND API TESTS"
    
    test_health_check
    test_signup
    test_otp_verification
    test_resend_otp
    test_verification_status
    test_invalid_otp
    
    print_header "MANUAL VERIFICATION TESTS"
    
    test_wallet_autocreation
    test_sms_delivery
    
    print_summary
    
    # Cleanup
    rm -f /tmp/kilimo_test_user_id /tmp/kilimo_test_phone
}

# Run main function
main
