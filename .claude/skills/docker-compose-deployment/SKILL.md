---
name: docker-compose-deployment
description: Containerize all ByteBuddies application services and implement or repair Docker Compose deployment, production images, service configuration, health checks, persistence, and deployment documentation.
---

# Docker Compose deployment

Read `CLAUDE.md` and section 11 of `docs/product-requirements.md` from the project root. Inspect actual apps, lockfiles, build commands, ports, configuration, and dependencies. Apply this skill when adding an app/service or changing packaging or deployment. For instructions-only work, update the guidance without inventing runnable artifacts.

## Package the actual services

- Containerize every application service, including any API or worker. Use maintained, versioned images for infrastructure that is actually needed. The local-progress MVP can be one web service; do not add a database merely to fill out Compose.
- Create production Dockerfiles, using multi-stage builds when compilation is needed. Install dependencies from the repository lockfile and keep only necessary runtime files. Use trusted pinned versions or digests with a documented update approach; avoid floating `latest` images.
- Run application processes as a non-root user, with correct writable-directory ownership and graceful shutdown. Serve on the container interface and declared port, rather than loopback only. Execute a production start command, not a development server.
- Add `.dockerignore` for each build context, excluding secrets, local dependencies, generated host output, and Git metadata while retaining required build inputs.
- If the app uses Next.js, inspect its version and output mode. For a standalone build, package the traced runtime plus static/public assets at their correct paths. Account for monorepo tracing and writable caches when applicable; verify the result rather than assuming the framework's build folder is sufficient.

## Compose and configuration

Provide a root `compose.yaml` using the current Compose Specification and the `docker compose` CLI. Make the default deployment production-oriented; use a separate development override only when needed. Keep source bind mounts and development commands out of production.

Configure service names, internal networks, required published ports, restart policy, and health checks using commands available inside each image. Use readiness-aware dependency conditions where necessary; startup order alone does not prove a dependency is ready. Applications must also handle transient connection failures after startup. Run migrations as an explicit step or completion-gated service only if the app has migrations.

Provide `.env.example` with safe example values. Distinguish Compose interpolation, container runtime environment, and build-time settings. Frontend public variables may be compiled into browser assets; never treat them as secrets or promise runtime configurability without implementing it. Keep credentials out of images, Docker build arguments, committed files, and logs. Use mounted secrets or suitable runtime injection; do not dump resolved secret values during validation.

Persist server-side data using named volumes and document backups/restores. Keep browser localStorage/IndexedDB on the learner's device; it is scoped to the site's origin and is not a Docker volume. Service containers use Compose service names for internal calls; browser requests need a public endpoint or same-origin proxy. Avoid publishing internal database/cache ports without a concrete need.

## Deployment runbook

Create or update `docs/deployment.md` with the exact files and commands the implementation supports. Cover prerequisites, configuration, build or versioned-image pull, startup, readiness, endpoint checks, logs, updates, rollback, and stopping services while retaining data. Record required Compose capabilities and any architecture constraints. Explain the deployment target's ingress/TLS when known; do not invent a hostname or hosting account.

Use immutable release identifiers when publishing images so rollback selects a known version. If migrations exist, document compatibility and backup requirements separately from image rollback. Do not recommend volume deletion or system pruning as routine deployment steps. Preparing deployment files does not itself require publishing images or changing a remote host; follow the user's requested deployment scope.

## Section review deployments

For an implementation section, deployment is part of completing the work before asking the user for feedback. Follow the approval boundary in `CLAUDE.md`. Deploy to the established review environment; when none is specified, use local Compose and give an accurate access URL. Do not invent a public URL or publish to an unspecified remote host. Missing Docker access, credentials, or a reachable endpoint is a blocker to resolve, not evidence of successful deployment.

After verification, keep the review stack running, identify the deployed revision, and provide a short checklist of functionality the user can exercise with expected outcomes. Ask the user to test and explicitly approve continuation. Wait before implementing or deploying the next section. Fix feedback, retest, and redeploy the current section before seeking approval again. Record the URL, revision, feedback, and actual approval in `docs/implementation-progress.md` during implementation.

## Verification

1. Verify Docker and Compose availability. Validate the intended file combination using `docker compose ... config --quiet` with safe test configuration.
2. Build every app image and start the whole stack with bounded readiness waits. Use an isolated Compose project/ports for local tests when another stack is running.
3. Inspect service health and logs, then test the actual container endpoint: static assets, Persian RTL routes, onboarding, lesson, assessment, and saved progress. Check mobile, tablet, and desktop layouts through that endpoint when browser tools are available.
4. Verify dependency behavior, graceful restart/recreation, and server data survival where applicable; confirm browser progress at the same origin. Clean up only disposable test resources created for this run, retaining data unless explicitly disposable. Keep the user-review stack running until review is finished or the user requests shutdown.
5. Record commands, outcomes, and limitations. A valid YAML file or successful image build alone is not a verified deployment. If app code or Docker is unavailable, state which checks remain unverified.

Consult the official references when implementing version-dependent behavior: [Compose production deployment](https://docs.docker.com/compose/how-tos/production/), [Docker build practices](https://docs.docker.com/build/building/best-practices/), and [dependency readiness](https://docs.docker.com/compose/how-tos/startup-order/).
