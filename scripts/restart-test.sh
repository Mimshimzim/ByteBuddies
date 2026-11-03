#!/usr/bin/env bash
# Verifies recovery: container restart, then force-recreate. Server has no data; checks health + smoke after each.
set -euo pipefail
cd "$(dirname "$0")/.."
. scripts/podman-env.sh
P="http://localhost:$BYTEBUDDIES_HOST_PORT"
echo "== restart"; podman restart bytebuddies-web >/dev/null
scripts/wait-healthy.sh bytebuddies-web 90; scripts/smoke.sh "$P"
echo "== force-recreate"; podman compose -p "$COMPOSE_PROJECT_NAME" up -d --force-recreate --no-build
scripts/wait-healthy.sh bytebuddies-web 90; scripts/smoke.sh "$P"
echo "== crash (SIGKILL main process from the Podman VM; restart policy must recover it)"
pid="$(podman inspect --format '{{.State.Pid}}' bytebuddies-web)"
podman machine ssh "kill -9 $pid"
sleep 3
scripts/wait-healthy.sh bytebuddies-web 120
n="$(podman inspect --format '{{.RestartCount}}' bytebuddies-web)"
[ "$n" -ge 1 ] || { echo "restart policy did not restart the container (RestartCount=$n)"; exit 1; }
scripts/smoke.sh "$P"
echo "restart tests OK (RestartCount=$n)"
