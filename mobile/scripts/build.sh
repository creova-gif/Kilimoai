#!/bin/bash

# Kilimo AI Mobile Build Trigger Script
# Usage: ./scripts/build.sh [platform] [profile]

PLATFORM=${1:-android}
PROFILE=${2:-preview}

echo "🚀 Starting EAS Build for Kilimo AI..."
echo "📍 Platform: $PLATFORM"
echo "📍 Profile: $PROFILE"

# Ensure we are in the mobile directory
cd "$(dirname "$0")/.."

# Check for EAS CLI
if ! command -v eas &> /dev/null
then
    echo "❌ EAS CLI could not be found. Please install it with: npm install -g eas-cli"
    exit 1
fi

# Trigger build
eas build --platform $PLATFORM --profile $PROFILE --non-interactive

echo "✅ Build triggered! Track progress at expo.dev/accounts/jaymafie/projects/kilimo-ai/builds"
