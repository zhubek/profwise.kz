#!/bin/bash

USER_ID="313271e4-53e5-4572-9c50-59b8b9836ea6"
LICENSE="6gXfy6TDf0"

echo "=== CACHE INVALIDATION TEST ==="
echo ""
echo "[1] Fetching quizzes to populate cache..."
curl -s "http://localhost:4000/quizzes/user/$USER_ID" > /dev/null
sleep 1

echo "[2] Verifying cache HIT..."
curl -s "http://localhost:4000/quizzes/user/$USER_ID" > /dev/null
sleep 1
echo "Recent logs:"
tail -3 /tmp/backend-final-test.log

echo ""
echo "[3] Activating license (should invalidate cache)..."
curl -s -X POST http://localhost:4000/licenses/activate \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_ID\",\"licenseCode\":\"$LICENSE\"}" | python3 -m json.tool | head -30
sleep 1

echo ""
echo "[4] Checking for invalidation message in logs..."
tail -10 /tmp/backend-final-test.log | grep -E "INVALIDATE|invalidat"

echo ""
echo "[5] Fetching quizzes again (should be MISS if invalidation worked)..."
curl -s "http://localhost:4000/quizzes/user/$USER_ID" > /dev/null
sleep 1
echo "Recent logs:"
tail -3 /tmp/backend-final-test.log
