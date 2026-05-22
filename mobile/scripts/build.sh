#!/bin/bash
# KILIMO AI — EAS Build Helper
# Usage: ./scripts/build.sh [android|ios|all] [preview|production]

set -e

PLATFORM=${1:-android}
PROFILE=${2:-preview}

echo "================================================"
echo "  KILIMO AI EAS Build"
echo "  Platform : $PLATFORM"
echo "  Profile  : $PROFILE"
echo "  Account  : @jaymafie/kilimo-ai"
echo "================================================"

if [ -z "$EXPO_TOKEN" ]; then
  echo "Error: EXPO_TOKEN environment variable is not set."
  echo "Add it to your shell: export EXPO_TOKEN=your_token_here"
  exit 1
fi

cd "$(dirname "$0")/.."

if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "all" ]; then
  echo ""
  echo "▶ Building Android ($PROFILE)..."
  eas build --platform android --profile "$PROFILE" --non-interactive
fi

if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "all" ]; then
  echo ""
  echo "▶ Building iOS ($PROFILE)..."
  eas build --platform ios --profile "$PROFILE" --non-interactive
fi

echo ""
echo "✓ Build submitted! Track progress at:"
echo "  https://expo.dev/accounts/jaymafie/projects/kilimo-ai/builds"
