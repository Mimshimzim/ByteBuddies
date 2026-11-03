#!/usr/bin/env bash
# Source this file: . scripts/podman-env.sh
export PATH="$HOME/.local/bin:$PATH"
export PODMAN_COMPOSE_PROVIDER="${PODMAN_COMPOSE_PROVIDER:-$HOME/.local/bin/podman-compose}"
export PODMAN_COMPOSE_WARNING_LOGS=false
export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-bytebuddies-review}"
export BYTEBUDDIES_HOST_PORT="${BYTEBUDDIES_HOST_PORT:-8080}"
if [ -z "${BYTEBUDDIES_IMAGE_TAG:-}" ] && [ "${BYTEBUDDIES_NEW_TAG:-0}" != 1 ]; then
  # Reuse the tag of the existing container (so restart/recreate never needs a rebuild).
  BYTEBUDDIES_IMAGE_TAG="$(podman inspect --format '{{.ImageName}}' bytebuddies-web 2>/dev/null | sed -n 's/.*bytebuddies-web://p')"
fi
if [ -z "${BYTEBUDDIES_IMAGE_TAG:-}" ]; then
  BYTEBUDDIES_IMAGE_TAG="$(date +%Y%m%d)-$(git rev-parse --short HEAD 2>/dev/null || echo local)"
fi
export BYTEBUDDIES_IMAGE_TAG
[ -x "$PODMAN_COMPOSE_PROVIDER" ] || { echo "podman-compose provider not found: $PODMAN_COMPOSE_PROVIDER" >&2; return 1 2>/dev/null || exit 1; }
if ! podman info >/dev/null 2>&1; then
  echo "Podman is not reachable. Run: podman machine start" >&2
  return 1 2>/dev/null || exit 1
fi
