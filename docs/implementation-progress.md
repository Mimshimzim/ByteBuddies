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
