# Implementation progress

Resume from this file after any interruption. **Approval is never inferred.**

## Section plan

| # | Section | Acceptance (observable) | Status |
|---|---------|------------------------|--------|
| 1 | **Foundation + Session 1 (آشنایی با رایانه)** | Persian RTL home, nickname/avatar/age onboarding, learning map, lesson player with age-adapted text, 7 Session-1 topics each with its own exam, checkpoint 1, glossary, XP/badges/persistence, labs: computer assembly + Windows desktop; Podman Compose review deployment | **Awaiting user review** |
| 2 | Session 2 (فایل‌ها و ذخیره‌سازی) | 10 topics + exams + checkpoint; labs: virtual file manager, file-type sorter, shortcuts trainer, compression simulator | Not started |
| 3 | Session 3 (امنیت و مدیریت ویندوز) | 8 topics + exams + checkpoint; labs: security detective, ports matching | Not started |
| 4 | Session 4 (مبانی شبکه و اینترنت) | 10 topics + exams + checkpoint; labs: network builder, command-line simulator | Not started |
| 5 | Enrichment, capstone, certificate, parent/teacher area | digital literacy, computational thinking, algorithm lab, capstone, certificate, roadmap, full QA | Not started |

## Requested CMS migration (2026-11-03)

The user approved PostgreSQL for the proposed Payload CMS architecture and requested agent/skill updates so Claude can implement it. This records an architecture decision and instruction update, not completed implementation or acceptance of Section 1. Keep the existing Section 1 approval pending. When CMS implementation is requested, prioritize the following milestones before extending Session 2; each requires deployed user review before the next begins.

| ID | Milestone | Acceptance (observable) | Status |
|---|---|---|---|
| CMS-1 | Editable lesson with Payload + PostgreSQL | Staff login, import one existing topic preserving IDs, edit a private draft, authenticated preview, publish to the real learner route without rebuilding, retain existing progress; Podman app/database deployment and review URLs | Planned; not started |
| CMS-2 | Full existing content migration | Sessions/topics/questions/exams/glossary/media/achievements managed in CMS; safe repeatable import; all existing static consumers migrated; scoring, unlocking, active attempts, and progress preserved | Planned; awaits CMS-1 approval |
| CMS-3 | Editorial and operational completion | Publish dependency checks, revisions/archival and restore behavior, staff permissions, cache invalidation, database/media backup and restore, production migration/rollback checks | Planned; awaits CMS-2 approval |

Baseline access control, draft isolation, valid publishing, and persistent storage are required from CMS-1; later milestones extend coverage rather than defer those fundamentals. Explicit CMS milestone approvals: none. This documentation update has not changed the running review deployment.

## Toolchain (verified 2026-11-03)
- Podman 6.0.2, machine `podman-machine-default` (libkrun) running
- `podman-compose` 1.6.0 at `~/.local/bin/podman-compose` (installed via `uv tool`); `podman compose` defaults to docker-compose here, so always set `PODMAN_COMPOSE_PROVIDER`
- Node v26.13.0, Next.js 16.4.4, React 19.3.1, Tailwind 4.3.4

## Log

### Section 1
- Status: implemented, deployed, awaiting user review. **Do not start Section 2 until the user explicitly approves.**
- Deployed: http://localhost:8080 — image `localhost/bytebuddies-web:20261103-e105ddc` (git `e105ddc`), project `bytebuddies-review`, container healthy.
- Checks run: typecheck clean; `npx vitest run` 5 files / 50 tests pass; `scripts/deploy-review.sh` 9 smoke checks pass; restart/recreate/crash-recovery script passed (on previous image tag); headless Chromium (Playwright) at 360/390px: no horizontal overflow on 8 routes, onboarding → map → lesson steps → locked topic notice → failing exam (0%) → retry → passing exam (100%) → next topic unlocked → XP 50 granted once → state survives reload; no console/page errors.
- Not verified: Persian copy by a native reader; lab drag-and-drop success paths in a real browser (reducer logic is unit-tested); tablet/desktop screenshots; contrast with a tool; Start-menu/min-age wording vs current official sources; host-reboot recovery.
- Known gaps: sessions 2–4 shown as «به‌زودی»; no hardware/software sorter or data-trace lab (no LabId, deferred to later section); no certificate/dark mode yet; `reviewStepId` links go to the topic, not the step.
- Feedback: _none_
- Explicit approval: _none_
