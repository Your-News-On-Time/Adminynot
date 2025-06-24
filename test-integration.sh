#!/bin/bash

echo "🧪 Testing Firebase Integration with Real Credentials"
echo "=================================================="

# Colores para output
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "\n${ORANGE}🔧 Testing API Endpoints...${NC}"

# Test Status endpoint
echo -e "\n📊 Status endpoint:"
curl -s http://localhost:4322/API/status | jq '.firebase'

# Test Users stats endpoint
echo -e "\n👥 Users stats endpoint:"
curl -s http://localhost:4322/API/usuarios | jq '.data | {total, verified, mode}'

# Test Users list endpoint
echo -e "\n📋 Users list endpoint:"
curl -s http://localhost:4322/API/usuarios-lista | jq '.data | {totalUsers, mode, firstUser: .users[0].email}'

# Test NewsData endpoint
echo -e "\n📰 NewsData test endpoint:"
NEWSDATA_RESULT=$(curl -s http://localhost:4322/API/test-newsdata)
NEWSDATA_SUCCESS=$(echo $NEWSDATA_RESULT | jq -r '.success')
if [ "$NEWSDATA_SUCCESS" = "true" ]; then
  echo "✅ NewsData API: Working"
else
  NEWSDATA_ERROR=$(echo $NEWSDATA_RESULT | jq -r '.error')
  if [[ "$NEWSDATA_ERROR" == *"429"* ]]; then
    echo "⚠️ NewsData API: Rate limit reached (API working)"
  else
    echo "❌ NewsData API: $NEWSDATA_ERROR"
  fi
fi

echo -e "\n${GREEN}✅ Integration Tests Complete!${NC}"
echo -e "Dashboard available at: ${GREEN}http://localhost:4322/dashboard${NC}"
echo ""
echo "🔑 To enable LIVE Firebase data (instead of demo):"
echo "   1. Generate a Firebase Service Account Key from:"
echo "      https://console.firebase.google.com/project/yournewsontime-dd461/settings/serviceaccounts/adminsdk"
echo "   2. Add the JSON content to .env as:"
echo "      FIREBASE_SERVICE_ACCOUNT_KEY='{\"type\":\"service_account\",...}'"
echo "   3. Restart the server with: npm run dev"
echo ""
