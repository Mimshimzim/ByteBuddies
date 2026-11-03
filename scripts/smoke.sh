#!/usr/bin/env bash
# Usage: smoke.sh [base_url]   (default http://localhost:${BYTEBUDDIES_HOST_PORT:-8080})
set -u
B="${1:-http://localhost:${BYTEBUDDIES_HOST_PORT:-8080}}"; fail=0
ok(){ echo "PASS $*"; }; bad(){ echo "FAIL $*"; fail=1; }
code(){ curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$1"; }
home="$(curl -s --max-time 10 "$B/")"
[ "$(code "$B/")" = 200 ] && ok "/ 200" || bad "/ not 200"
echo "$home" | grep -q 'lang="fa"' && ok 'lang="fa"' || bad 'lang="fa" missing'
echo "$home" | grep -q 'dir="rtl"' && ok 'dir="rtl"' || bad 'dir="rtl" missing'
for p in /map /start /glossary; do
  [ "$(code "$B$p")" = 200 ] && ok "$p 200" || bad "$p not 200"
done
asset="$(echo "$home" | grep -o '/_next/static/[^"'"'"' )\\]*\.\(js\|css\)' | head -1)"
if [ -n "$asset" ] && [ "$(code "$B$asset")" = 200 ]; then ok "static asset $asset"; else bad "static asset unreachable (${asset:-none found})"; fi
nf="$(curl -s --max-time 10 -w '\n%{http_code}' "$B/no-such-page-xyz")"
[ "${nf##*$'\n'}" = 404 ] && ok "404 status" || bad "404 status wrong"
echo "$nf" | grep -q '[؀-ۿ]' && ok "404 page Persian" || bad "404 page not Persian"
exit $fail
