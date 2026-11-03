---
name: podman-compose-deployment
description: Containerize all ByteBuddies application services and implement or repair Podman Compose deployment, production images, service configuration, health checks, persistence, and deployment documentation.
---

# Podman Compose deployment

Read `CLAUDE.md` and section 11 of `docs/product-requirements.md` from the project root. Inspect actual apps, lockfiles, build commands, ports, configuration, and dependencies. Apply this skill when adding an app/service or changing packaging or deployment. For instructions-only work, update the guidance without inventing runnable artifacts.

## Package the actual services

- Containerize every application service, including any API or worker. Use maintained, versioned images for infrastructure that is actually needed. The local-progress MVP can be one web service; do not add a database merely to fill out Compose.
- Create production Containerfiles, using multi-stage builds when compilation is needed. Install dependencies from the repository lockfile and keep only necessary runtime files. Use fully qualified registry/image names with trusted pinned versions or digests with a documented update approach; avoid floating `latest` images.
- Run application processes as a non-root user, with correct writable-directory ownership and graceful shutdown. Serve on the container interface and declared port, rather than loopback only. Execute a production start command, not a development server.
- Add `.containerignore` for each build context, excluding secrets, local dependencies, generated host output, and Git metadata while retaining required build inputs.
- If the app uses Next.js, inspect its version and output mode. For a standalone build, package the traced runtime plus static/public assets at their correct paths. Account for monorepo tracing and writable caches when applicable; verify the result rather than assuming the framework's build folder is sufficient.

## Podman runtime and provider

Use rootless Podman where supported. On macOS, inspect `podman machine list`; initialize a machine only if none is configured, and start the selected machine when needed. Verify the active connection with `podman info`. Reuse existing machines and preserve their data.

`podman compose` delegates to an external provider. Install/use `podman-compose` and select its executable explicitly with `PODMAN_COMPOSE_PROVIDER` in documented commands or project scripts. Do not depend on Docker Engine or Docker Desktop. Record Podman and provider versions and check `podman compose --help` and subcommand help before using flags.

Verify the selected provider's support for dependency conditions, health checks, secrets, build options, and wait behavior. If a feature is unsupported, implement and document an equivalent Podman-compatible approach, such as a bounded readiness polling step; do not silently drop the requirement or switch back to Docker. For Linux deployment, account for rootless port and volume permissions and SELinux labels where applicable. Verify host access to published ports on macOS. Document host-reboot recovery separately from a container restart policy.

## Compose and configuration

Provide a root `compose.yaml` using the Compose Specification and the `podman compose` CLI with the selected `podman-compose` provider. Set `build.dockerfile: Containerfile` explicitly for each application build context; `dockerfile` is the Compose schema key even when the runtime is Podman. Make the default deployment production-oriented; use a separate development override only when needed. Keep source bind mounts and development commands out of production.

Configure service names, internal networks, required published ports, restart policy, and health checks using commands available inside each image. Use readiness-aware dependency conditions where necessary; startup order alone does not prove a dependency is ready. Applications must also handle transient connection failures after startup. Run migrations as an explicit step or completion-gated service only if the app has migrations.

Provide `.env.example` with safe example values. Distinguish Compose interpolation, container runtime environment, and build-time settings. Frontend public variables may be compiled into browser assets; never treat them as secrets or promise runtime configurability without implementing it. Keep credentials out of images, Podman build arguments, committed files, and logs. Use mounted secrets or suitable runtime injection; do not dump resolved secret values during validation.

Persist server-side data using named volumes and document backups/restores. Keep browser localStorage/IndexedDB on the learner's device; it is scoped to the site's origin and is not a Podman volume. Service containers use Compose service names for internal calls; browser requests need a public endpoint or same-origin proxy. Avoid publishing internal database/cache ports without a concrete need.

## Deployment runbook

Create or update `docs/deployment.md` with the exact files and commands the implementation supports. Cover prerequisites, configuration, build or versioned-image pull, startup, readiness, endpoint checks, logs, updates, rollback, and stopping services while retaining data. Record required Compose capabilities and any architecture constraints. Explain the deployment target's ingress/TLS when known; do not invent a hostname or hosting account.

Use immutable release identifiers when publishing images so rollback selects a known version. If migrations exist, document compatibility and backup requirements separately from image rollback. Do not recommend volume deletion or system pruning as routine deployment steps. Preparing deployment files does not itself require publishing images or changing a remote host; follow the user's requested deployment scope.

## Section review deployments

For an implementation section, deployment is part of completing the work before asking the user for feedback. Follow the approval boundary in `CLAUDE.md`. Deploy to the established review environment; when none is specified, use local Compose and give an accurate access URL. Do not invent a public URL or publish to an unspecified remote host. Missing Podman access, credentials, or a reachable endpoint is a blocker to resolve, not evidence of successful deployment.

After verification, keep the review stack running, identify the deployed revision, and provide a short checklist of functionality the user can exercise with expected outcomes. Ask the user to test and explicitly approve continuation. Wait before implementing or deploying the next section. Fix feedback, retest, and redeploy the current section before seeking approval again. Record the URL, revision, feedback, and actual approval in `docs/implementation-progress.md` during implementation.

## Verification

1. Verify Podman, its active connection/machine, and the selected Compose provider. Validate the intended file combination with `podman compose ... config` using safe test configuration; use `--quiet` only if the installed provider supports it. Keep resolved credentials out of reported output.
2. Build every app image and start the whole stack with bounded readiness waits. Use an isolated Compose project/ports for local tests when another stack is running.
3. Inspect service health and logs, then test the actual container endpoint: static assets, Persian RTL routes, onboarding, lesson, assessment, and saved progress. Check mobile, tablet, and desktop layouts through that endpoint when browser tools are available.
4. Verify dependency behavior, graceful restart/recreation, and server data survival where applicable; confirm browser progress at the same origin. Clean up only disposable test resources created for this run, retaining data unless explicitly disposable. Keep the user-review stack running until review is finished or the user requests shutdown.
5. Record commands, outcomes, and limitations. A valid YAML file or successful image build alone is not a verified deployment. If app code or Podman is unavailable, state which checks remain unverified.

Consult the official references when implementing version-dependent behavior: [Podman Compose and providers](https://docs.podman.io/en/latest/markdown/podman-compose.1.html), [Podman machine](https://docs.podman.io/en/latest/markdown/podman-machine.1.html), and [Podman builds and Containerfiles](https://docs.podman.io/en/latest/markdown/podman-build.1.html).
