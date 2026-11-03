# ByteBuddies deployment (Podman Compose)

One service: `web` (Next.js 16 standalone build). There is no backend, database or volume: learner progress lives in the browser's localStorage, scoped to the site origin (`http://localhost:8080`). It is not part of any container and is not affected by recreating containers.

## Tested versions (macOS, arm64)

| Component | Version |
| --- | --- |
| Podman client/server | 6.0.2 (libkrun machine `podman-machine-default`, Fedora 44 VM) |
| podman-compose (provider) | 1.6.0 at `~/.local/bin/podman-compose` |
| Base image | `docker.io/library/node:22.22-alpine3.23` (Node 22.22.3; Next 16 needs Node >= 20.9) |
| Host Node (tests only) | 26.13.0 |

## Prerequisites

1. A running Podman machine: `podman machine list` must show `Currently running`; otherwise `podman machine start`. Never `init`/`rm` an existing machine.
2. `podman-compose` installed and selected explicitly. On this machine plain `podman compose` would pick `docker-compose` first if it exists, so always export:

```sh
export PATH="$HOME/.local/bin:$PATH"
export PODMAN_COMPOSE_PROVIDER="$HOME/.local/bin/podman-compose"
export PODMAN_COMPOSE_WARNING_LOGS=false
```

`source scripts/podman-env.sh` does this, checks Podman is reachable, and picks `BYTEBUDDIES_IMAGE_TAG` (reuses the tag of the existing container, else `YYYYMMDD-<git sha>`). Docker is not required.

## Configuration

Copy `.env.example` to `.env` (optional; defaults exist). All values are Compose interpolation only, no secrets:

- `COMPOSE_PROJECT_NAME` (review stack: `bytebuddies-review`; scripts also pass `-p`)
- `BYTEBUDDIES_IMAGE_TAG`: immutable image tag `localhost/bytebuddies-web:<tag>`
- `BYTEBUDDIES_HOST_PORT`: host port (default 8080), mapped to container port 3000

Build-time vs runtime: nothing is baked in from the environment. `HOSTNAME=0.0.0.0`, `PORT=3000`, `NODE_ENV=production` are runtime settings. The container runs as uid 10001, read-only root filesystem, `tmpfs` on `/tmp` and `/app/.next/cache`, all capabilities dropped (verified: `CapEff` is all zeros inside the container), `no-new-privileges`.

## Deploy (build, start, verify)

```sh
scripts/deploy-review.sh                     # build + up -d + wait healthy + smoke
BYTEBUDDIES_HOST_PORT=8081 scripts/deploy-review.sh   # if 8080 is busy (check: lsof -i :8080)
```

Manual equivalent:

```sh
source scripts/podman-env.sh
podman compose -p bytebuddies-review config            # resolved config
podman compose -p bytebuddies-review build
podman compose -p bytebuddies-review up -d
scripts/wait-healthy.sh bytebuddies-web 90             # bounded poll of podman health state
scripts/smoke.sh http://localhost:8080
```

Access (macOS): open `http://localhost:8080`; Podman forwards the published port from the VM to the host (verified with curl).

## Health, logs, status

```sh
podman compose -p bytebuddies-review ps
podman inspect --format '{{.State.Health.Status}}' bytebuddies-web
podman logs -f bytebuddies-web
```

`scripts/smoke.sh` checks: `/` is 200 with `lang="fa"` and `dir="rtl"`; `/map`, `/start`, `/glossary` return 200; a `/_next/static` asset linked from the home page is served; an unknown URL returns 404 with Persian text.

## Update and rollback (tag based)

Each deploy builds a new immutable tag; old tags stay in local storage.

```sh
BYTEBUDDIES_IMAGE_TAG=s2-20261110 scripts/deploy-review.sh   # update to a new tag
podman image ls localhost/bytebuddies-web                      # known tags
# rollback: start an existing tag, no rebuild
export BYTEBUDDIES_IMAGE_TAG=<old-tag>; source scripts/podman-env.sh
podman compose -p bytebuddies-review up -d --force-recreate --no-build
```

(`podman-env.sh` reuses the running container's tag when `BYTEBUDDIES_IMAGE_TAG` is unset, so set it explicitly when rolling back.) There is no server data or migration, so rollback is image-only. Updating the base image: change the `NODE_IMAGE` default in `Containerfile`, rebuild, run tests and the smoke script.

## Stop, restart, recovery

```sh
podman compose -p bytebuddies-review down      # non-destructive stop+remove container; never use -v/--volumes or prune
podman compose -p bytebuddies-review up -d --no-build   # start again from the existing image
```

Container crash: `restart: unless-stopped` restarts the process. Host reboot / Podman VM stopped: the restart policy cannot run while the VM is down. Recover with `podman machine start`, then `source scripts/podman-env.sh && podman compose -p bytebuddies-review up -d --no-build` (containers with a restart policy may already be back; `up -d` is idempotent). Automatic start at login is not configured.

`scripts/restart-test.sh` exercises restart, force-recreate and a crash (SIGKILL of the main process from inside the VM via `podman machine ssh`), checking health and smoke after each.

## Provider capability findings (podman-compose 1.6.0 via `podman compose`)

Verified by running them:
- `config`, `build` (`build.dockerfile: Containerfile`), `up -d`, `ps`, `down`, `-p`: work.
- Compose `healthcheck` is applied and Podman reports `healthy`. The Containerfile `HEALTHCHECK` instruction is ignored for OCI-format images (Podman warns), so health is defined only in `compose.yaml`.
- `restart`, `read_only`, `tmpfs`, `cap_drop`, `security_opt: no-new-privileges`, port mapping, `container_name`: applied (confirmed with `podman inspect`).
- `podman kill` / `podman stop` count as a manual stop, so the restart policy does not revive the container; a real process crash does.
- `up --wait` / `--wait-timeout` appear in the help, but the deployment scripts do not rely on them: readiness uses `scripts/wait-healthy.sh`. `depends_on` conditions, secrets and multi-service ordering are not used (single service) and were not tested.
- `--quiet` on `config` was not used.

## Limitations

- Local review deployment only; no TLS, ingress, registry push or public hostname. Images are `localhost/` local images.
- Image size ~212 MB.
- Linux hosts: published port 8080 works rootless; no volumes means no SELinux label concerns.
