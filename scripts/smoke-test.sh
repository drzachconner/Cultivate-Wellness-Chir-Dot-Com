#!/usr/bin/env bash
# Production smoke test for Cultivate Wellness Chiropractic
# Run after deploy to verify all endpoints are healthy

set -euo pipefail

SITE="https://cultivatewellnesschiro.com"
AGENT="https://cultivate-agent.drzach.ai"
PASS=0
FAIL=0

check() {
  local label="$1" url="$2" expected="$3"
  status=$(curl -s -L -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  if [ "$status" = "$expected" ]; then
    echo "  ✓ $label ($status)"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $label — expected $expected, got $status"
    FAIL=$((FAIL + 1))
  fi
}

check_contains() {
  local label="$1" url="$2" pattern="$3"
  body=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")
  if echo "$body" | grep -q "$pattern"; then
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $label — pattern '$pattern' not found"
    FAIL=$((FAIL + 1))
  fi
}

check_not_contains() {
  local label="$1" url="$2" pattern="$3"
  body=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "")
  if echo "$body" | grep -q "$pattern"; then
    echo "  ✗ $label — pattern '$pattern' was found (should be absent)"
    FAIL=$((FAIL + 1))
  else
    echo "  ✓ $label"
    PASS=$((PASS + 1))
  fi
}

echo "=== Cultivate Wellness Production Smoke Test ==="
echo ""

echo "1. Public pages (expect 200):"
check "Home"              "$SITE/"                  200
check "About Us"          "$SITE/about-us"          200
check "Meet Dr Zach"      "$SITE/meet-dr-zach"      200
check "Pediatric"         "$SITE/pediatric"         200
check "Prenatal"          "$SITE/prenatal"           200
check "Family"            "$SITE/family"             200
check "Contact Us"        "$SITE/contact-us"         200
check "Conditions"        "$SITE/conditions"         200
check "INSiGHT Scans"    "$SITE/insight-scans"      200
check "Workshops"         "$SITE/workshops"          200
check "New Patient Info"  "$SITE/new-patient-info"   200
check "RHKN Guide"        "$SITE/rhkn-guide"         200
check "Free Guides"       "$SITE/free-guides-for-parents" 200
check "Sitemap"           "$SITE/sitemap.xml"        200
check "Robots.txt"        "$SITE/robots.txt"         200
echo ""

echo "2. Admin route (expect 200 — SPA serves index.html):"
check "Admin"             "$SITE/admin"              200
echo ""

echo "3. API endpoints (Cloudflare Functions):"
status_chat=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -X POST "$SITE/api/chat" -H "Content-Type: application/json" -d '{}' 2>/dev/null || echo "000")
if [ "$status_chat" = "400" ] || [ "$status_chat" = "401" ] || [ "$status_chat" = "500" ]; then
  echo "  ✓ POST /api/chat with empty body ($status_chat — not 404)"
  PASS=$((PASS + 1))
else
  echo "  ✗ POST /api/chat — expected 4xx/5xx, got $status_chat"
  FAIL=$((FAIL + 1))
fi

status_form=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 -X POST "$SITE/api/form-handler" -H "Content-Type: application/json" -d '{}' 2>/dev/null || echo "000")
if [ "$status_form" = "400" ] || [ "$status_form" = "500" ]; then
  echo "  ✓ POST /api/form-handler with empty body ($status_form — not 404)"
  PASS=$((PASS + 1))
else
  echo "  ✗ POST /api/form-handler — expected 400/500, got $status_form"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "4. Agent backend (through Cloudflare tunnel):"
# Health check without redirect-following (tunnel doesn't redirect)
status_health=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$AGENT/health" 2>/dev/null || echo "000")
if [ "$status_health" = "200" ]; then
  echo "  ✓ Health (200)"
  PASS=$((PASS + 1))
else
  echo "  ✗ Health — expected 200, got $status_health"
  FAIL=$((FAIL + 1))
fi
status_noauth=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$AGENT/api/v1/projects/cultivate-wellness/usage" 2>/dev/null || echo "000")
if [ "$status_noauth" = "401" ]; then
  echo "  ✓ Usage without auth (401 — correctly rejected)"
  PASS=$((PASS + 1))
else
  echo "  ✗ Usage without auth — expected 401, got $status_noauth"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "5. SEO verification:"
check_contains     "robots.txt has /admin disallow"  "$SITE/robots.txt"    "Disallow: /admin"
check_not_contains "sitemap excludes /admin"         "$SITE/sitemap.xml"   "/admin"
# Note: JSON-LD is injected client-side by React, not in static HTML shell.
# Verify the JS bundle contains the Schema.org component instead.
check_contains     "Home HTML serves SPA shell"     "$SITE/"              "<div id=\"root\">"
echo ""

echo "6. CORS verification:"
cors_resp=$(curl -s -D - -o /dev/null --max-time 10 -H "Origin: https://cultivatewellnesschiro.com" "$AGENT/health" 2>&1 || echo "")
if echo "$cors_resp" | grep -qi "access-control-allow-origin"; then
  echo "  ✓ CORS header present for production origin"
  PASS=$((PASS + 1))
else
  echo "  ✗ CORS header missing for production origin"
  FAIL=$((FAIL + 1))
fi
echo ""

echo "=== Results: $PASS passed, $FAIL failed ==="
if [ "$FAIL" -eq 0 ]; then
  echo "ALL CHECKS PASSED"
  exit 0
else
  echo "SOME CHECKS FAILED"
  exit 1
fi
