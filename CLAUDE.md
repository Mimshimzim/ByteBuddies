# Computer Kids — project instructions

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

Containerize every application service and use Docker Compose for deployment. Deliver production Dockerfiles, appropriate `.dockerignore` files, a root `compose.yaml`, a documented configuration example, and `docs/deployment.md` when implementing the app. Include any backend, worker, or infrastructure dependency actually introduced; do not add unnecessary services to the browser-storage MVP. Production containers must run built application artifacts, not development servers or source bind mounts. Follow `/docker-compose-deployment` and validate the deployed containers before claiming deployment readiness.

When implementing the full course, maintain `docs/curriculum-coverage.md` with each section 4 bullet mapped to topic IDs, content files, practice, and assessments. Record missing items honestly. Build complete authored coverage with quizzes across all four sessions before spending disproportionate effort polishing one session. Staged delivery does not change the final acceptance criteria.

Run the checks supported by the actual project. Prioritize scoring, unlock conditions, repeated rewards, storage recovery, lab state transitions, RTL, and accessible learner flows. Report what ran, what passed, and anything unverified. Do not claim completion from a successful build alone.

## Claude resources

- Agent: `.claude/agents/persian-learning-builder.md` for implementing a scoped product feature or the full course when requested.
- `/persian-curriculum`: lesson authoring, question content, glossary, curriculum coverage.
- `/persian-rtl-ui`: Persian layout, typography, responsive design, accessible UI.
- `/safe-learning-labs`: simulated Windows, hardware, file, security, networking, and algorithm activities.
- `/mastery-progress`: assessment engine, retries, XP, unlocking, persistence, certificates.
- `/docker-compose-deployment`: Docker packaging for all application services and deployment through Docker Compose.
- `/learning-platform-review`: evidence-based review against the source prompt.

Use the skills that match the task. Usage examples are in `.claude/README.md`.
