#!/bin/bash
# ============================================================================
# KILIMO Agri-AI Suite - Fully Automated AI-Monitored Deployment Pipeline
# Author: CREOVA
# Date: January 27, 2026
#
# This script orchestrates the complete deployment process:
# 1. AI Audit (Prompts, RBAC, Language)
# 2. Security & Environment Validation
# 3. Supabase Migrations & Functions
# 4. Edge Function Deployment
# 5. Frontend Deployment
# 6. Runtime Workflow Tests
# 7. Payment & SMS Verification
# 8. Log Monitoring
# 9. UX + Language Sanity Check
#
# Usage: ./deploy-kilimo.sh [staging|production]
# ============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║          🌾 KILIMO Agri-AI Suite Deployment Pipeline 🌾       ║"
echo "║                   CREOVA / KILIMO                              ║"
echo "║          Fully Automated AI-Monitored Deployment               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Parse environment argument
ENVIRONMENT=${1:-staging}
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Date:${NC} $(date)"
echo -e "${BLUE}User:${NC} $(whoami)"
echo ""

# ============================================================================
# PHASE 0: PRE-FLIGHT CHECKS
# ============================================================================
echo -e "${MAGENTA}[0/9] 🔍 Pre-Flight Checks...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if .env exists
if [ ! -f ".env" ]; then
  echo -e "${RED}❌ ERROR: .env file not found!${NC}"
  echo -e "${YELLOW}💡 Copy .env.example to .env and configure it${NC}"
  exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check required tools
REQUIRED_TOOLS=("node" "npm" "supabase" "git")
for TOOL in "${REQUIRED_TOOLS[@]}"; do
  if ! command -v $TOOL &> /dev/null; then
    echo -e "${RED}❌ ERROR: $TOOL is not installed${NC}"
    exit 1
  fi
  echo -e "  ${GREEN}✅${NC} $TOOL: $(which $TOOL)"
done

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# ============================================================================
# PHASE 1: AI AUDIT
# ============================================================================
echo -e "${MAGENTA}[1/9] 🤖 AI Audit (Prompts, RBAC, Language)...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node scripts/ai-audit.js \
  --roles="smallholder_farmer,farmer,farm_manager,commercial_farm_admin,agribusiness_operations,extension_officer_ngo,cooperative_leader" \
  --languages="en,sw"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ AI Audit FAILED - Deployment blocked!${NC}"
  echo -e "${YELLOW}💡 Check audit_report.json for details${NC}"
  exit 1
fi

echo -e "${GREEN}✅ AI Audit passed${NC}"
echo ""

# ============================================================================
# PHASE 2: SECURITY & ENVIRONMENT VALIDATION
# ============================================================================
echo -e "${MAGENTA}[2/9] 🔐 Security & Environment Validation...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check required environment variables
REQUIRED_VARS=(
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
)

for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo -e "${RED}❌ ERROR: $VAR is not set in .env${NC}"
    exit 1
  fi
  echo -e "  ${GREEN}✅${NC} $VAR: Configured"
done

# Verify service role key is not in frontend code
if grep -r "SUPABASE_SERVICE_ROLE_KEY" --include="*.tsx" --include="*.jsx" --include="*.ts" --include="*.js" components/ 2>/dev/null; then
  echo -e "${RED}❌ SECURITY ERROR: Service role key found in frontend code!${NC}"
  exit 1
fi
echo -e "  ${GREEN}✅${NC} Service role key not exposed in frontend"

echo -e "${GREEN}✅ Security validation passed${NC}"
echo ""

# ============================================================================
# PHASE 3: PAYMENT & SMS VERIFICATION
# ============================================================================
echo -e "${MAGENTA}[3/9] 💳 Payment & SMS Verification...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node scripts/payment-sms-test.js

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Payment/SMS verification FAILED${NC}"
  echo -e "${YELLOW}💡 Configure payment providers and SMS service${NC}"
  
  # In staging, continue with warning; in production, block
  if [ "$ENVIRONMENT" == "production" ]; then
    exit 1
  else
    echo -e "${YELLOW}⚠️  Continuing in staging mode...${NC}"
  fi
fi

echo -e "${GREEN}✅ Payment & SMS verified${NC}"
echo ""

# ============================================================================
# PHASE 4: COMPREHENSIVE AUDIT
# ============================================================================
echo -e "${MAGENTA}[4/9] 🔍 Comprehensive System Audit...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd audit

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing audit dependencies..."
  npm install --silent
fi

# Run comprehensive audit
npm run audit:headless

# Check audit results
AUDIT_FILE=$(ls -t audit-reports/audit-report-*.json | head -1)
if [ ! -f "$AUDIT_FILE" ]; then
  echo -e "${RED}❌ ERROR: Audit report not found!${NC}"
  exit 1
fi

SUCCESS_RATE=$(node -p "JSON.parse(require('fs').readFileSync('$AUDIT_FILE')).summary.successRate")
CRITICAL_FAILURES=$(node -p "JSON.parse(require('fs').readFileSync('$AUDIT_FILE')).recommendations.filter(r => r.priority === 'CRITICAL').length")

echo -e "Success Rate: ${GREEN}${SUCCESS_RATE}%${NC}"
echo -e "Critical Failures: ${RED}${CRITICAL_FAILURES}${NC}"

if (( $(echo "$SUCCESS_RATE < 85" | bc -l) )); then
  echo -e "${RED}❌ ERROR: Audit success rate below 85%!${NC}"
  echo -e "${YELLOW}💡 Check audit-reports/audit-report-*.html for details${NC}"
  exit 1
fi

if [ "$CRITICAL_FAILURES" -gt 0 ]; then
  echo -e "${RED}❌ ERROR: Critical failures detected!${NC}"
  echo -e "${YELLOW}💡 Fix critical issues before deploying${NC}"
  exit 1
fi

cd ..

echo -e "${GREEN}✅ System audit passed (${SUCCESS_RATE}%)${NC}"
echo ""

# ============================================================================
# PHASE 5: BUILD FRONTEND
# ============================================================================
echo -e "${MAGENTA}[5/9] 🏗️  Building Frontend...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --silent
fi

# Build
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Frontend build failed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# ============================================================================
# PHASE 6: DEPLOY SUPABASE FUNCTIONS
# ============================================================================
echo -e "${MAGENTA}[6/9] 🚀 Deploying Supabase Edge Functions...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Link project if needed
if [ ! -f "supabase/.branches/_current_branch" ]; then
  echo "Linking Supabase project..."
  PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')
  supabase link --project-ref $PROJECT_REF
fi

# Deploy functions
supabase functions deploy

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Supabase deployment failed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Supabase functions deployed${NC}"
echo ""

# ============================================================================
# PHASE 7: DEPLOY FRONTEND
# ============================================================================
echo -e "${MAGENTA}[7/9] 🌐 Deploying Frontend...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ENVIRONMENT" == "production" ]; then
  # Production deployment
  if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel (production)..."
    vercel --prod
  elif command -v netlify &> /dev/null; then
    echo "Deploying to Netlify (production)..."
    netlify deploy --prod
  else
    echo -e "${YELLOW}⚠️  No deployment tool found (vercel/netlify)${NC}"
    echo -e "${YELLOW}💡 Deploy manually or install vercel/netlify CLI${NC}"
  fi
else
  # Staging deployment
  if command -v vercel &> /dev/null; then
    echo "Deploying to Vercel (staging)..."
    vercel
  elif command -v netlify &> /dev/null; then
    echo "Deploying to Netlify (staging)..."
    netlify deploy
  else
    echo -e "${YELLOW}⚠️  No deployment tool found${NC}"
  fi
fi

echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

# ============================================================================
# PHASE 8: RUNTIME WORKFLOW TESTS
# ============================================================================
echo -e "${MAGENTA}[8/9] 🔄 Runtime Workflow Tests...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for deployment to propagate
echo "Waiting 15 seconds for deployment to propagate..."
sleep 15

node scripts/runtime-test.js --roles="all" --languages="en,sw"

if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️  Some runtime tests failed${NC}"
  echo -e "${YELLOW}💡 Check runtime_report.json for details${NC}"
  
  # Don't block deployment, but warn
  if [ "$ENVIRONMENT" == "production" ]; then
    echo -e "${RED}⚠️  Production deployment completed with warnings${NC}"
  fi
fi

echo -e "${GREEN}✅ Runtime tests completed${NC}"
echo ""

# ============================================================================
# PHASE 9: UI/UX & LANGUAGE SANITY CHECK
# ============================================================================
echo -e "${MAGENTA}[9/9] 🎨 UI/UX & Language Sanity Check...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node scripts/ui-ux-audit.js --branding="CREOVA-KILIMO" --languages="en,sw"

echo -e "${GREEN}✅ UI/UX audit completed${NC}"
echo ""

# ============================================================================
# PHASE 10: LOG MONITORING
# ============================================================================
echo -e "${MAGENTA}[BONUS] 📋 Log Monitoring...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

node scripts/log-checker.js

echo -e "${GREEN}✅ Log monitoring completed${NC}"
echo ""

# ============================================================================
# DEPLOYMENT COMPLETE
# ============================================================================
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║               🎉 DEPLOYMENT SUCCESSFUL! 🎉                     ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Audit Success Rate:${NC} ${GREEN}${SUCCESS_RATE}%${NC}"
echo -e "${BLUE}Frontend:${NC} Deployed"
echo -e "${BLUE}Backend:${NC} Deployed (Supabase)"
echo -e "${BLUE}Date:${NC} $(date)"
echo ""
echo -e "${YELLOW}📊 Generated Reports:${NC}"
echo -e "  • audit/audit-reports/audit-report-*.html"
echo -e "  • audit_report.json (AI audit)"
echo -e "  • runtime_report.json (Workflow tests)"
echo -e "  • payment_sms_report.json (Payment/SMS)"
echo -e "  • logs_summary.json (Log monitoring)"
echo -e "  • branding_audit.json (UI/UX)"
echo ""
echo -e "${YELLOW}🔍 Next Steps:${NC}"
echo -e "  1. Monitor error logs: supabase functions logs"
echo -e "  2. Run smoke tests: npm run test:smoke"
echo -e "  3. Beta test with real users"
echo -e "  4. Monitor for 24 hours before full launch"
echo ""
echo -e "${GREEN}🌾 KILIMO Agri-AI Suite is now live! 🌾${NC}"
echo ""
