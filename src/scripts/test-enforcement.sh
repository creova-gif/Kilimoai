#!/bin/bash

# KILIMO Brand Color Enforcement - Test Script
# Tests the enforcement system with sample violations

echo "🔒 KILIMO BRAND COLOR ENFORCEMENT TEST"
echo "======================================"
echo ""

# Create temporary test file with violations
TEST_FILE="/tmp/test-violations.tsx"

cat > "$TEST_FILE" << 'EOF'
import React from 'react';

export function TestComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* VIOLATION 1: Blue color */}
      <button className="bg-blue-600 text-white">
        Click me
      </button>
      
      {/* VIOLATION 2: Gradient */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600">
        Gradient background
      </div>
      
      {/* VIOLATION 3: Pink color */}
      <span className="text-pink-600">Warning text</span>
      
      {/* CORRECT: Brand color */}
      <div className="bg-[#2E7D32] text-white">
        Correct brand color
      </div>
      
      {/* CORRECT: Gray neutrals */}
      <div className="bg-gray-100 text-gray-900 border-gray-200">
        Correct neutral colors
      </div>
    </div>
  );
}
EOF

# Copy test file to components directory temporarily
cp "$TEST_FILE" "./components/TEST_VIOLATIONS.tsx"

echo "📝 Created test file with 3 violations..."
echo ""
echo "Running enforcement script..."
echo ""

# Run the enforcement script
node ./scripts/enforce-brand-colors.js

# Capture exit code
EXIT_CODE=$?

# Cleanup
rm -f "./components/TEST_VIOLATIONS.tsx"
rm -f "$TEST_FILE"

echo ""
echo "======================================"

if [ $EXIT_CODE -eq 1 ]; then
  echo "✅ TEST PASSED: Enforcement script correctly detected violations"
  echo "✅ Build would be blocked as expected"
  exit 0
else
  echo "❌ TEST FAILED: Enforcement script should have detected violations"
  exit 1
fi
