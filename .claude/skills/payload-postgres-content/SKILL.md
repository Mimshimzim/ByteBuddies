---
name: payload-postgres-content
description: Implement Payload CMS with PostgreSQL for ByteBuddies, migrating static course content into protected editing, drafts, preview, publishing, and runtime delivery while preserving learner progress.
---

# Payload and PostgreSQL content management

Read root `CLAUDE.md`, section 11 of `docs/product-requirements.md`, and `docs/implementation-progress.md`. The user approved Payload with PostgreSQL. Apply the current request's scope: instruction updates do not themselves request CMS implementation. For implementation, work only on the current CMS milestone, deploy it through Podman, and wait for user approval at the section boundary.

## Preserve the existing application

Inspect `src/lib/types.ts`, `src/content/index.ts`, session exports and question helpers, diagram/lab registries, content consumers, progress storage, tests, and deployment scripts. Search all imports of `@/content`, including unlock/reward logic and parent/review/profile screens; changing lesson files alone does not make content dynamic. Preserve authored Persian text, both age-band variants and fallbacks, working routes, and local progress.

Integrate Payload into the existing Next.js app with `@payloadcms/next` and `@payloadcms/db-postgres`. Verify compatibility with the actual Next/React/Node versions and pin a compatible set of Payload packages. Use route groups as needed to isolate the CMS admin layout from the learner shell without changing existing URLs. Keep database clients and Payload initialization server-only.

## Content model

Map CMS records to the existing TypeScript domain contracts through a validated adapter. Database IDs are internal; use unique, immutable `contentId` values for existing session/topic/question/exam/term/achievement identities. Explicitly preserve nested step, option, pair, and ordering-item IDs even if Payload generates its own array-row IDs. Never derive identity from mutable titles or array positions.

- Sessions: ordering, labels, topic relationships, checkpoint, badge.
- Topics: purpose, objectives, coverage, duration, age-specific text, ordered steps, recap, glossary references, enrichment flag.
- Questions: typed fields for all supported question kinds, answers, explanations, hints, concepts, and review step references.
- Exams: kind, topic/session relationships, question pool, draw count, pass threshold, revision.
- Glossary: Persian term/definition, optional technical term, category, topic references.
- Media: validated uploads and Persian descriptions/alt text; persist files outside image layers.
- Achievements: copy and validated supported rule variants, not arbitrary scripts.
- Staff users: authenticated editors and publishers/admins, separate from learner profiles.

Keep ordered steps embedded in topics where practical and reusable questions in their own collection. Use structured fields/blocks for predictable rendering. Start with existing paragraph text semantics; do not force a rich-text conversion that loses content. Offer allowlisted diagram/lab selectors and supported configuration. Executable React/SVG simulation logic stays in source code; editing it still requires development.

## Staff access and publication

Provide usable Persian editing fields and RTL text inputs. Staff may create/edit drafts; only authorized publishers may publish or restore published revisions. Public reads return published records only; writes and draft previews require authorization. Enforce this on APIs and relationships, not only by hiding admin buttons. For Payload Local API calls, explicitly enforce access with the correct user context (including `overrideAccess: false` where appropriate) or constrain trusted server queries equivalently; do not assume local calls inherit HTTP permissions.

Enable drafts/version history and authenticated preview that never enters public caches. Validate objectives, steps, stable IDs, answer keys, question pool/draw counts, references, allowed diagram/lab keys, and progression before publication. Related drafts must not leak through populated relationships. Stage dependencies and publish a consistent set or reject publication while dependencies are missing; never expose a partially valid exam. Reject archive/unpublish operations that break live dependencies unless a coordinated retirement handles them.

Implement publish/unpublish/restore invalidation so the affected lesson, map, glossary, exam, and review data update without a new image. Specify when an already-open page refreshes; reload/revisit is sufficient initially, realtime collaboration is not required. Distinguish editorial version restoration from database backup restoration.

## Runtime delivery and progression

Introduce a content repository such as `src/lib/content/server.ts` exposing published curriculum summaries, topics, exams, and glossary. Return plain validated domain data via server components or narrow endpoints into client renderers. Refactor static singleton consumers to accept an explicit published snapshot or client content provider. Include content loading, unavailable, and not-found states without resetting progress or pretending a failed request means an empty course.

Keep drafts, staff data, database credentials, and secrets out of public bundles. Decide and document the assessment boundary: existing low-stakes client grading can be retained for parity but exposes answer data; protected grading requires server-side evaluation. Do not introduce learner registration or silently promise tamper-proof certificates.

Preserve existing localStorage keys and domain/reward identities. Pin an active attempt's questions, answers, and scoring revision; publication cannot change a running attempt. Ordinary content edits must not revoke mastery or re-award XP. Add revision metadata backwards-compatibly and retain legacy records with no fabricated revision values. Archive content rather than deleting history that progress references.

## Import and cutover

Build an explicit import command using the exported objects from the current session modules so helper-generated answer/option IDs and correct ordering survive. Validate counts, IDs, text, answer keys, references, and rendered output before switching readers. Use stable content IDs to prevent duplicates; default repeat runs skip existing editorial records and report conflicts. Do not seed on every startup or overwrite CMS edits silently.

For CMS-1, route one chosen existing topic through CMS and keep unmigrated topics on an explicit temporary source mapping. A migrated topic's CMS failure must not silently fall back to a stale TypeScript copy. Retain existing files as seed/rollback fixtures until parity is verified. CMS-2 removes production imports of legacy content for all migrated consumers; new course content then uses the CMS. Preserve section acceptance gates and original curriculum scope.

## Podman and PostgreSQL

Extend the existing Compose stack and deployment scripts with PostgreSQL readiness, a named database volume, internal connectivity, and persisted media. Supply runtime `DATABASE_URL` and a stable `PAYLOAD_SECRET` securely; bootstrap staff through a documented procedure with no committed/default password. Respect non-root app permissions and existing read-only filesystem settings by adding only necessary writable mounts.

Check in database migrations; run them in a single controlled deployment step before the new app serves traffic. Do not use development schema push in production, require a live production database at image build time, or automatically run destructive migrations. Back up existing data before risky schema changes and document rollback compatibility and verified database/media restore. Use the installed Podman Compose provider and retain the review origin for local learner progress.

## Milestone verification

For CMS-1, test staff login, denied anonymous edits/preview, draft isolation, preview, publish-to-learner without rebuild, existing lesson navigation/progress, and persistence after container recreation. Give actual admin and learner URLs with a review checklist; wait for explicit approval.

For CMS-2/3, additionally verify import parity and repeatability, no overwritten editor edits, all migrated runtime consumers, invalid references/answers rejected, option IDs stable across reorder, active exam revision consistency, no duplicate XP, publish/unpublish/restore cache behavior, database-outage UI, and backup/restore in an isolated environment. Run the actual type/build/tests and container smoke checks; record unverified behavior honestly.

Use official documentation for version-dependent details: [installation](https://payloadcms.com/docs/getting-started/installation), [PostgreSQL](https://payloadcms.com/docs/database/postgres), [drafts](https://payloadcms.com/docs/versions/drafts), and [access control](https://payloadcms.com/docs/access-control/overview).
