#!/bin/bash

# CROP LIBRARY INITIALIZATION SCRIPT
# Initializes the Supabase Storage bucket and seeds the crop database

echo "🌱 Initializing KILIMO Crop Library..."
echo ""

# Get Supabase project details
PROJECT_ID="${SUPABASE_PROJECT_ID:-your-project-id}"
API_KEY="${SUPABASE_ANON_KEY:-your-anon-key}"

# API endpoint
API_BASE="https://${PROJECT_ID}.supabase.co/functions/v1/make-server-ce1844e7"

echo "📦 Creating crop-images storage bucket..."
echo "📚 Seeding crop database with 50+ Tanzanian crops..."
echo ""

# Call initialization endpoint
response=$(curl -s -X GET \
  "${API_BASE}/crop-library/init" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json")

echo "Response: $response"
echo ""

# Check if successful
if echo "$response" | grep -q '"success":true'; then
  echo "✅ Crop library initialized successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Visit the Crop Library page in the app"
  echo "2. Click on any crop to view details"
  echo "3. Click 'Generate AI Image' to create photorealistic crop images"
  echo ""
  echo "Note: AI image generation uses DALL-E via OpenRouter and takes 30-60 seconds per image."
  echo "Images are cached permanently after generation."
else
  echo "❌ Failed to initialize crop library"
  echo ""
  echo "Please check:"
  echo "1. SUPABASE_PROJECT_ID is set correctly"
  echo "2. SUPABASE_ANON_KEY is set correctly"
  echo "3. Server is running"
  echo "4. OPENROUTER_API_KEY is configured in Supabase secrets"
fi
