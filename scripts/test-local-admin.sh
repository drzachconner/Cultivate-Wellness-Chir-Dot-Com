#!/bin/bash
# test-local-admin.sh — Local admin API integration test script
# Tests all admin endpoints against agent-backend at localhost:3100
# Usage: bash scripts/test-local-admin.sh

set -uo pipefail

BASE="http://localhost:3100"
PASS="${CULTIVATE_ADMIN_PASSWORD:-}"

# Read from agent-backend .env if not in env
if [ -z "$PASS" ]; then
  PASS=$(grep CULTIVATE_ADMIN_PASSWORD ~/Code/agent-backend/.env 2>/dev/null | cut -d= -f2 || echo "")
fi

if [ -z "$PASS" ]; then
  echo "ERROR: CULTIVATE_ADMIN_PASSWORD not found in env or ~/Code/agent-backend/.env"
  exit 1
fi

FAIL=0
PASS_COUNT=0
TOTAL=0

# check <label> <expected_code> <actual_code>
check_code() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  TOTAL=$((TOTAL + 1))
  if [ "$actual" = "$expected" ]; then
    echo "  PASS [$actual] $label"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "  FAIL [$actual != $expected] $label"
    FAIL=$((FAIL + 1))
  fi
}

# check_contains <label> <expected_substring> <actual_body>
check_contains() {
  local label="$1"
  local expected="$2"
  local actual="$3"
  TOTAL=$((TOTAL + 1))
  if echo "$actual" | grep -q "$expected"; then
    echo "  PASS [contains '$expected'] $label"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "  FAIL [missing '$expected'] $label"
    echo "       Got: $(echo "$actual" | head -3)"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Cultivate Wellness Admin API Integration Tests ==="
echo "Target: $BASE"
echo ""

# -------------------------------------------------------
# 1. Health
# -------------------------------------------------------
echo "1. Health endpoint"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/health")
check_code "GET /health returns 200" "200" "$CODE"

# -------------------------------------------------------
# 2. Project info (requires auth)
# -------------------------------------------------------
echo ""
echo "2. Project info endpoint"
BODY=$(curl -s -H "Authorization: Bearer $PASS" "$BASE/api/v1/projects/cultivate-wellness/info")
CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $PASS" "$BASE/api/v1/projects/cultivate-wellness/info")
check_code "GET /api/v1/projects/cultivate-wellness/info returns 200" "200" "$CODE"
check_contains "Project info contains 'cultivate-wellness'" "cultivate-wellness" "$BODY"

# -------------------------------------------------------
# 3. Auth rejection (no Bearer token)
# -------------------------------------------------------
echo ""
echo "3. Auth rejection test"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/api/v1/projects/cultivate-wellness/usage")
check_code "GET /usage without Bearer returns 401" "401" "$CODE"

# -------------------------------------------------------
# 4. Auth acceptance (with correct Bearer token)
# -------------------------------------------------------
echo ""
echo "4. Auth acceptance test"
CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $PASS" "$BASE/api/v1/projects/cultivate-wellness/usage")
check_code "GET /usage with Bearer returns 200" "200" "$CODE"

# -------------------------------------------------------
# 5. CORS — production origin accepted
# -------------------------------------------------------
echo ""
echo "5. CORS origin tests"
CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://cultivatewellnesschiro.com" \
  "$BASE/health")
check_code "CORS: production origin https://cultivatewellnesschiro.com accepted (200)" "200" "$CODE"

# -------------------------------------------------------
# 6. CORS — evil origin rejected
# -------------------------------------------------------
CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Origin: https://evil.com" \
  "$BASE/health")
check_code "CORS: unknown origin https://evil.com rejected (500)" "500" "$CODE"

# -------------------------------------------------------
# 7. Conversations list
# -------------------------------------------------------
echo ""
echo "7. Conversations list endpoint"
CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PASS" \
  "$BASE/api/v1/projects/cultivate-wellness/conversations")
check_code "GET /conversations with auth returns 200" "200" "$CODE"

BODY=$(curl -s -H "Authorization: Bearer $PASS" "$BASE/api/v1/projects/cultivate-wellness/conversations")
check_contains "Conversations response contains 'conversations' key" "conversations" "$BODY"

# -------------------------------------------------------
# 8. Chat SSE streaming
# -------------------------------------------------------
echo ""
echo "8. Chat SSE streaming test (may take up to 120s — Claude agent startup)"
# Note: omit conversationId so agent-backend auto-creates a new conversation.
# Passing an unknown conversationId causes a FOREIGN KEY constraint error.
# Write to temp file to avoid subshell capture issues with SSE streams.
SSE_TMP=$(mktemp /tmp/cultivate-sse-test.XXXXXX)
CHAT_BODY='{"messages":[{"role":"user","content":"Reply with just the word: hello"}]}'

curl -s -m 120 -N \
  -H "Authorization: Bearer $PASS" \
  -H "Content-Type: application/json" \
  -H "Origin: https://cultivatewellnesschiro.com" \
  -d "$CHAT_BODY" \
  "$BASE/api/v1/projects/cultivate-wellness/chat" > "$SSE_TMP" 2>/dev/null || true

TOTAL=$((TOTAL + 1))
if grep -q "^data:" "$SSE_TMP"; then
  echo "  PASS [SSE streaming] Chat endpoint returns streamed 'data:' lines"
  PASS_COUNT=$((PASS_COUNT + 1))
  FIRST_DATA=$(grep "^data:" "$SSE_TMP" | head -1)
  echo "       First line: $FIRST_DATA"
elif grep -q "data:" "$SSE_TMP"; then
  echo "  PASS [SSE streaming] Chat endpoint returns 'data:' content"
  PASS_COUNT=$((PASS_COUNT + 1))
  FIRST_DATA=$(grep "data:" "$SSE_TMP" | head -1)
  echo "       First line: $FIRST_DATA"
else
  echo "  FAIL [no 'data:' lines found] Chat SSE test"
  echo "       Response: $(head -3 "$SSE_TMP")"
  FAIL=$((FAIL + 1))
fi
rm -f "$SSE_TMP"

# -------------------------------------------------------
# Summary
# -------------------------------------------------------
echo ""
echo "========================================"
echo "Results: $PASS_COUNT passed, $FAIL failed (of $TOTAL total)"
echo "========================================"

if [ "$FAIL" -eq 0 ]; then
  echo ""
  echo "ALL CHECKS PASSED"
  echo ""
  exit 0
else
  echo ""
  echo "SOME CHECKS FAILED — see output above"
  echo ""
  exit 1
fi
