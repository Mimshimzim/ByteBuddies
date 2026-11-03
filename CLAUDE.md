# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Computer Kids — project instructions

## Current state

The repo holds only configuration and docs: `docs/product-requirements.md` (the spec), `.claude/` (one agent, six skills, `README.md` with usage examples), and this file. No application, `package.json`, tests, or Podman files exist yet, so there are no build, lint, or test commands. Once an app is scaffolded, record its real commands in project docs and here.
## Source of truth

Read `docs/product-requirements.md` before planning or implementing the platform. Its numbered sections define the product; this file is a working guide, not a replacement. Follow the current user request for task scope. A request to configure agents or skills does not itself request building the website.

The product is a complete Persian computer-fundamentals learning experience for ages 7–14, preparing learners for programming. Priorities are substantial Persian teaching, working learning functionality, polished design, then extensibility. A landing page or one completed session does not fulfill the full product request.

## Product invariants

- All learner-facing text is natural Persian, including errors, accessibility labels, quizzes, certificates, and parent/teacher views. Use RTL layout and isolated LTR technical strings.
- Preserve all four core sessions and every curriculum bullet in section 4. Enrichment supports these sessions without replacing them.
- Every topic needs the complete lesson structure in section 6 and its own assessment. Include four session checkpoints, a practical capstone, and an earned certificate.
- Adapt explanations for ages 7–10 and 11–14 while preserving essential concepts. Older-learner enrichment must not block the younger path.
- Learning interactions must work, explain outcomes, and support keyboard or equivalent controls. Implement all 11 required labs before declaring the product complete.
- Simulate email, files, installation, partitioning, system tools, and terminal commands. Never require real account creation, device changes, file access, or destructive commands to learn.
- Prefer nickname/avatar onboarding and local progress. Do not require identifying information, add public social features, advertising, or profiling.
- Reward mastery and meaningful practice, allow supportive retries, and avoid repeat-click XP farming or pressure-based streaks.
- The entire app must be responsive on mobile, tablet, and desktop. Navigation, lessons, exams, labs, dialogs, and certificates must remain usable across screen sizes, with touch and keyboard support and no clipped controls or page-level horizontal overflow.

## Repository

Use `git@github.com:Mimshimzim/ByteBuddies.git` as the project's Git remote (`origin`). Preserve existing remote history; do not force-push. Keep local secrets, dependency folders, and build output out of commits.

## Implementation conventions

Inspect the actual repository before selecting tools or giving commands. If no application exists and the user requests implementation, the prompt prefers Next.js, React, TypeScript, and Tailwind CSS; retain a suitable existing stack. Use the installed versions and package manager rather than assuming commands or APIs.

Keep typed curriculum, questions, glossary, achievements, and prerequisites separate from UI. Use stable IDs, reusable lesson/quiz renderers, explicit simulation state, and a central progress model. Persist with localStorage or IndexedDB for the MVP, with schema validation and graceful recovery. Access browser storage safely in any server-rendered app.

Containerize every application service and use Podman Compose for deployment. Deliver production Containerfiles, appropriate `.containerignore` files, a root `compose.yaml`, a documented configuration example, and `docs/deployment.md` when implementing the app. Include any backend, worker, or infrastructure dependency actually introduced; do not add unnecessary services to the browser-storage MVP. Production containers must run built application artifacts, not development servers or source bind mounts. Use `podman compose` with an explicitly selected `podman-compose` provider and verify its supported features; on macOS, use a running Podman machine. Follow `/podman-compose-deployment` and validate the deployed containers before claiming deployment readiness.

When implementing the full course, maintain `docs/curriculum-coverage.md` with each section 4 bullet mapped to topic IDs, content files, practice, and assessments. Record missing items honestly. Build complete authored coverage with quizzes across all four sessions before spending disproportionate effort polishing one session. Staged delivery does not change the final acceptance criteria.

Run the checks supported by the actual project. Prioritize scoring, unlock conditions, repeated rewards, storage recovery, lab state transitions, RTL, and accessible learner flows. Report what ran, what passed, and anything unverified. Do not claim completion from a successful build alone.

## Section delivery and user approval

Follow the user's requested review cadence: finish a meaningful section, deploy it, ask for functional feedback, and wait for explicit approval before starting the next section.

- At implementation start, outline substantial, independently reviewable sections with observable acceptance criteria. A section is a coherent user-facing feature or learning journey, not an individual file, component, or small change. Begin the first section within the requested scope without adding a separate planning approval gate.
- Complete implementation, routine decisions, checks, and small fixes within the current section autonomously. Do not ask for approval after each edit or test. Include the infrastructure needed to deploy the first reviewable section.
- Before requesting feedback, deploy the current section through Podman Compose to the established review environment and verify its endpoint and core behavior. Keep that review service running while awaiting feedback. Use a local review deployment when no remote target is specified; explain how the user can access it. If deployment or access is blocked, report the blocker instead of claiming readiness or proceeding to the next section.
- Present the section name, what works, the actual review URL, checks performed, known limitations, and a short checklist with steps and expected results. Explicitly ask the user to test service functionality and either approve continuation or request changes.
- Stop at that boundary. Passing tests, silence, elapsed time, or general authorization to build the app is not approval for the next section. Do not start later sections in the background while waiting.
- Address requested feedback within the same section, retest, redeploy, and ask for review again. Group related small fixes into one review request. Continue only after the user explicitly approves the current result or explicitly changes this review policy.
- During implementation, record sections, current status, deployed revision/URL, feedback, and explicit approvals in `docs/implementation-progress.md`. Resume from that record after interruptions; do not infer approval. Section acceptance does not waive unfinished product requirements or prove full-course completion.

## Claude resources

- Agent: `.claude/agents/persian-learning-builder.md` for implementing a scoped product feature or the full course when requested.
- `/persian-curriculum`: lesson authoring, question content, glossary, curriculum coverage.
- `/persian-rtl-ui`: Persian layout, typography, responsive design, accessible UI.
- `/safe-learning-labs`: simulated Windows, hardware, file, security, networking, and algorithm activities.
- `/mastery-progress`: assessment engine, retries, XP, unlocking, persistence, certificates.
- `/podman-compose-deployment`: Podman packaging for all application services and deployment through Podman Compose.
- `/learning-platform-review`: evidence-based review against the source prompt.

Use the skills that match the task. Usage examples are in `.claude/README.md`.
