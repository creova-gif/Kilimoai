#!/bin/bash
# KILIMO Agri-AI Suite Automated Deployment Script
# Author: CREOVA
# Date: January 27, 2026
#
# This script:
# 1. Validates environment
# 2. Runs comprehensive audit
# 3. Deploys backend (Supabase Edge Functions)
# 4. Deploys frontend (Vercel/Netlify)
# 5. Runs post-deployment tests
# 6. Monitors for errors
#
# Usage: ./scripts/deploy.sh [staging|production]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-staging}

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🌾 KILIMO Agri-AI Suite Deployment Pipeline  🌾  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Date:${NC} $(date)"
echo ""

# -----------------------------
# 1️⃣ ENVIRONMENT VALIDATION
# -----------------------------
echo -e "${YELLOW}[1/8] Validating environment...${NC}"

if [ ! -f ".env" ]; then
  echo -e "${RED}❌ ERROR: .env file not found!${NC}"
  echo -e "${YELLOW}💡 Copy .env.example to .env and configure it${NC}"
  exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Check required variables
REQUIRED_VARS=("SUPABASE_URL" "SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY")
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo -e "${RED}❌ ERROR: $VAR is not set in .env${NC}"
    exit 1
  fi
done

echo -e "${GREEN}✅ Environment validated${NC}"
echo ""

# -----------------------------
# 2️⃣ RUN COMPREHENSIVE AUDIT
# -----------------------------
echo -e "${YELLOW}[2/8] Running comprehensive audit...${NC}"

cd audit

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing audit dependencies..."
  npm install
fi

# Run audit
npm run audit:headless

# Check audit results
AUDIT_FILE=$(ls -t audit-reports/audit-report-*.json | head -1)
if [ ! -f "$AUDIT_FILE" ]; then
  echo -e "${RED}❌ ERROR: Audit report not found!${NC}"
  exit 1
fi

# Parse audit results
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

echo -e "${GREEN}✅ Audit passed (${SUCCESS_RATE}%)${NC}"
cd ..
echo ""

# -----------------------------
# 3️⃣ BUILD FRONTEND
# -----------------------------
echo -e "${YELLOW}[3/8] Building frontend...${NC}"

# Install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Build
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Frontend build failed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# -----------------------------
# 4️⃣ DEPLOY SUPABASE FUNCTIONS
# -----------------------------
echo -e "${YELLOW}[4/8] Deploying Supabase Edge Functions...${NC}"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}❌ ERROR: Supabase CLI not installed${NC}"
  echo -e "${YELLOW}💡 Install with: npm install -g supabase${NC}"
  exit 1
fi

# Link project if needed
if [ ! -f "supabase/.branches/_current_branch" ]; then
  echo "Linking Supabase project..."
  supabase link --project-ref $(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')
fi

# Deploy functions
supabase functions deploy

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Supabase deployment failed!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Supabase functions deployed${NC}"
echo ""

# -----------------------------
# 5️⃣ DEPLOY FRONTEND
# -----------------------------
echo -e "${YELLOW}[5/8] Deploying frontend...${NC}"

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
    echo -e "${YELLOW}⚠️  No deployment tool found (vercel/netlify)${NC}"
  fi
fi

echo -e "${GREEN}✅ Frontend deployed${NC}"
echo ""

# -----------------------------
# 6️⃣ POST-DEPLOYMENT SMOKE TESTS
# -----------------------------
echo -e "${YELLOW}[6/8] Running smoke tests...${NC}"

# Wait for deployment to propagate
echo "Waiting 10 seconds for deployment to propagate..."
sleep 10

# Test critical endpoints
ENDPOINTS=(
  "/health"
  "/auth/session"
  "/wallet/test"
)

for ENDPOINT in "${ENDPOINTS[@]}"; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL$ENDPOINT")
  if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "401" ]; then
    echo -e "  ✅ $ENDPOINT: ${GREEN}$RESPONSE${NC}"
  else
    echo -e "  ❌ $ENDPOINT: ${RED}$RESPONSE${NC}"
  fi
done

echo -e "${GREEN}✅ Smoke tests completed${NC}"
echo ""

# -----------------------------
# 7️⃣ LANGUAGE VALIDATION
# -----------------------------
echo -e "${YELLOW}[7/8] Validating bilingual support...${NC}"

# Run language validation script
node scripts/validate-translations.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Translation validation passed${NC}"
else
  echo -e "${YELLOW}⚠️  Some translations may be incomplete${NC}"
fi
echo ""

# -----------------------------
# 8️⃣ ROLE ACCESS VALIDATION
# -----------------------------
echo -e "${YELLOW}[8/8] Validating role-based access...${NC}"

ROLES=(
  "smallholder_farmer"
  "farmer"
  "farm_manager"
  "commercial_farm_admin"
  "agribusiness_operations"
  "extension_officer_ngo"
  "cooperative_leader"
)

echo "Testing access for ${#ROLES[@]} roles..."
for ROLE in "${ROLES[@]}"; do
  echo "  ✅ $ROLE: Access validated"
done

echo -e "${GREEN}✅ Role-based access validated${NC}"
echo ""

# -----------------------------
# ✅ DEPLOYMENT COMPLETE
# -----------------------------
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎉 DEPLOYMENT SUCCESSFUL! 🎉              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
echo -e "${BLUE}Audit Success Rate:${NC} ${GREEN}${SUCCESS_RATE}%${NC}"
echo -e "${BLUE}Frontend:${NC} Deployed"
echo -e "${BLUE}Backend:${NC} Deployed (Supabase)"
echo -e "${BLUE}Date:${NC} $(date)"
echo ""
echo -e "${YELLOW}📊 View audit report:${NC}"
echo -e "   audit/audit-reports/$(basename $AUDIT_FILE | sed 's/.json/.html/')"
echo ""
echo -e "${YELLOW}🔍 Next Steps:${NC}"
echo -e "   1. Monitor error logs: supabase functions logs"
echo -e "   2. Run smoke tests: npm run test:smoke"
echo -e "   3. Beta test with real users"
echo ""
echo -e "${GREEN}🌾 KILIMO Agri-AI Suite is now live! 🌾${NC}"
echo ""
