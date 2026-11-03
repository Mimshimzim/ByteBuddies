#!/usr/bin/env bash
# Bounded poll of container health. Usage: wait-healthy.sh [container] [timeout_s]
set -u
C="${1:-bytebuddies-web}"; T="${2:-90}"; end=$((SECONDS+T))
while [ $SECONDS -lt $end ]; do
  s="$(podman inspect --format '{{.State.Health.Status}}' "$C" 2>/dev/null || echo missing)"
  [ "$s" = healthy ] && { echo "$C healthy"; exit 0; }
  sleep 2
done
echo "$C not healthy after ${T}s (last status: $s)" >&2
podman logs --tail 30 "$C" >&2 || true
exit 1
