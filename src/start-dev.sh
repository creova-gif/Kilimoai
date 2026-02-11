#!/bin/bash

# ============================================================================
# KILIMO APP - STARTUP & DEBUG SCRIPT
# ============================================================================
# This script checks for common issues and starts the development server
# ============================================================================

echo "🌾 KILIMO Agri-AI Suite - Startup Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) detected${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ node_modules found${NC}"
fi

# Check critical files
echo ""
echo "Checking critical files..."

critical_files=(
    "App.tsx"
    "index.html"
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "src/main.tsx"
    "styles/globals.css"
)

missing_files=()

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file (MISSING)${NC}"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Critical files are missing!${NC}"
    echo "Missing files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "Please restore these files before starting the app."
    exit 1
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo ""
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
    echo "Another process is using port 3000. Kill it? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Killing process on port 3000..."
        lsof -ti:3000 | xargs kill -9
        echo -e "${GREEN}✅ Port 3000 is now available${NC}"
    else
        echo "Please stop the process manually and try again."
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🚀 Starting KILIMO Development Server...${NC}"
echo "=========================================="
echo ""
echo "The app will be available at:"
echo "  • Local:   http://localhost:3000"
echo "  • Network: Check the output below"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev

# If npm run dev fails
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Failed to start development server${NC}"
    echo ""
    echo "Troubleshooting steps:"
    echo "1. Check the error message above"
    echo "2. Try: rm -rf node_modules && npm install"
    echo "3. Try: npm run build"
    echo "4. Open diagnostic.html in browser for detailed checks"
    echo ""
    exit 1
fi
