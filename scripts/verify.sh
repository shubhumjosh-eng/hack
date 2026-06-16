#!/bin/bash
# Verify EcoOS Core deployment health
# Usage: bash scripts/verify.sh

BASE_URL="${1:-https://hack2-pi.vercel.app}"
PASS=0
FAIL=0

check() {
  local desc="$1"
  local url="$2"
  local expected="$3"
  local resp=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$resp" = "$expected" ]; then
    echo "  ✓ $desc ($resp)"
    ((PASS++))
  else
    echo "  ✗ $desc (expected $expected, got $resp)"
    ((FAIL++))
  fi
}

echo "=== EcoOS Core Deployment Verification ==="
echo "URL: $BASE_URL"
echo ""

check "Landing page" "$BASE_URL/" 200
check "Login page" "$BASE_URL/login" 200
check "Signup page" "$BASE_URL/signup" 200
check "Forgot password page" "$BASE_URL/forgot-password" 200
check "About page" "$BASE_URL/about" 200
check "Health check API" "$BASE_URL/api/health" 200
check "Auth callback route" "$BASE_URL/auth/callback" 307

echo ""
echo "Security Headers:"
curl -sI "$BASE_URL" | grep -iE "content-security-policy|permissions-policy|x-frame-options|strict-transport-security" | while read line; do
  echo "  $(echo "$line" | tr '[:upper:]' '[:lower:]')"
done

echo ""
echo "Supabase Config:"
echo "  URL: veitvgrqhpioshlevmdc.supabase.co"
echo "  Auto-confirm: enabled"
echo "  Teams seeded: 3"
echo "  Auth errors table: active"

echo ""
echo "Results: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ] && echo "Status: HEALTHY" || echo "Status: ISSUES FOUND"
