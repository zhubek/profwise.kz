#!/bin/bash

# API Performance Testing Script
# Tests all major API endpoints and measures response time and payload size

API_URL="http://localhost:4000"
USER_ID="9d1baa3b-cefe-4e08-96f2-b6e088f01e87"  # Test user ID
QUIZ_ID="80830f64-1a37-4cc1-8659-df72da0ff4f1"  # Holland test ID
PROFESSION_ID="00082e4f-f2f6-459f-a48f-2bc7f32ff03e"  # Sample profession ID

echo "==================================================================="
echo "API PERFORMANCE ANALYSIS"
echo "==================================================================="
echo ""

# Function to test an endpoint
test_endpoint() {
  local name=$1
  local url=$2
  local auth_header=$3

  echo "Testing: $name"
  echo "URL: $url"

  if [ -z "$auth_header" ]; then
    result=$(time curl -s -w "\nTime: %{time_total}s\nSize: %{size_download} bytes\nStatus: %{http_code}\n" "$url" 2>&1)
  else
    result=$(time curl -s -H "$auth_header" -w "\nTime: %{time_total}s\nSize: %{size_download} bytes\nStatus: %{http_code}\n" "$url" 2>&1)
  fi

  echo "$result" | grep -E "(Time:|Size:|Status:)"
  echo "-------------------------------------------------------------------"
  echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. QUIZ/TEST ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get All Quizzes" "$API_URL/quizzes"
test_endpoint "Get Specific Quiz" "$API_URL/quizzes/$QUIZ_ID"
test_endpoint "Get Quiz Instructions" "$API_URL/quizzes/$QUIZ_ID/instructions"
test_endpoint "Get User Quizzes" "$API_URL/quizzes/user/$USER_ID"
test_endpoint "Get Quiz Questions" "$API_URL/questions?quizId=$QUIZ_ID"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. RESULTS ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get User Results" "$API_URL/results?userId=$USER_ID"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. PROFESSION ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get All Professions" "$API_URL/professions"
test_endpoint "Get Specific Profession" "$API_URL/professions/$PROFESSION_ID"
test_endpoint "Get Profession Description" "$API_URL/professions/$PROFESSION_ID/description"
test_endpoint "Get Profession Archetypes" "$API_URL/professions/$PROFESSION_ID/archetypes"
test_endpoint "Get Profession Education" "$API_URL/professions/$PROFESSION_ID/education"
test_endpoint "Get Profession Market Research" "$API_URL/professions/$PROFESSION_ID/market-research"
test_endpoint "Get Profession Description Data" "$API_URL/professions/$PROFESSION_ID/description-data"
test_endpoint "Get User Matched Professions" "$API_URL/users/$USER_ID/professions"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. USER ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get User Profile" "$API_URL/users/$USER_ID"
test_endpoint "Get User Archetype Profile" "$API_URL/users/$USER_ID/archetype-profile"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. ARCHETYPE ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get Archetype Types" "$API_URL/archetypes/types/all"
test_endpoint "Get All Archetypes" "$API_URL/archetypes"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. CATEGORIES ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get All Categories" "$API_URL/categories"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. UNIVERSITIES & SPECS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

test_endpoint "Get All Universities" "$API_URL/universities"
test_endpoint "Get All Specs" "$API_URL/specs"

echo "==================================================================="
echo "PERFORMANCE ANALYSIS COMPLETE"
echo "==================================================================="
