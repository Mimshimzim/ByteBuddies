#!/usr/bin/env bash
# Build, (re)start and verify the review stack. Never uses -v / prune.
set -euo pipefail
cd "$(dirname "$0")/.."
BYTEBUDDIES_NEW_TAG=1  # deploy builds a new tag unless BYTEBUDDIES_IMAGE_TAG is set
export BYTEBUDDIES_NEW_TAG
. scripts/podman-env.sh
echo "Image tag: $BYTEBUDDIES_IMAGE_TAG  Port: $BYTEBUDDIES_HOST_PORT"
podman compose -p "$COMPOSE_PROJECT_NAME" build
podman compose -p "$COMPOSE_PROJECT_NAME" up -d
scripts/wait-healthy.sh bytebuddies-web 90
scripts/smoke.sh "http://localhost:$BYTEBUDDIES_HOST_PORT"
echo "Review URL: http://localhost:$BYTEBUDDIES_HOST_PORT  (image localhost/bytebuddies-web:$BYTEBUDDIES_IMAGE_TAG)"
