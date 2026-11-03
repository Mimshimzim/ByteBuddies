---
name: learning-platform-review
description: Review implemented Computer Kids features or the complete site against the Persian curriculum prompt, checking teaching coverage, working learner flows, accessibility, safety, and persistence.
---

# Learning platform review

Read `docs/product-requirements.md` from the project root, especially sections 4, 6, 8–11, and 15. Inspect the actual implementation and available run/test scripts. A coverage document is an index to evidence, not proof that content or behavior exists.

Use the requested scope. For a focused feature review, check affected behavior and integrations. For a whole-platform review, trace every acceptance criterion. A review request is primarily diagnostic; fix code when the user also requests fixes.

## Content and coverage

- Map every curriculum bullet in all four sessions to substantive Persian explanations, objectives, teaching visuals, guided practice, glossary, and its own exam.
- Verify both age bands retain the essential concepts; check that enrichment is identifiable and does not gate younger learners.
- Check actual question stems, distractors, answer keys, explanations, and objective alignment. Confirm topic exams, four session checkpoints with practical tasks, and the cross-domain capstone.
- Identify repetitive filler, untranslated component defaults, incorrect technical claims, empty routes, and cosmetic interactions.

## Behavioral walkthrough

Use existing automated tests and, when available, a running browser. Exercise onboarding without registration, map navigation, a complete lesson, a failed exam, review, retry, passing, unlocking, refresh, and resumed progress. Verify completion/certificate gates using test fixtures where appropriate; do not fake completion in production content to pass a review.

Check all 11 required labs from section 9 for actual state changes, success, failure explanation, reset, and keyboard alternatives. Confirm that simulated terminal, files, messages, disks, and installation do not act on real devices or accounts.

Check XP/badge idempotency, best-attempt retention, optional-topic independence, direct locked-route access, and unavailable/corrupt storage. Ensure all core topics, four checkpoints, and the capstone are required for completion.

## Presentation and child experience

Inspect phone, tablet, and desktop layouts with long Persian text and mixed LTR tokens. Use representative widths of 360, 768, and 1440 CSS pixels, intermediate sizes, and tablet landscape; record the viewports actually checked. Cover navigation, lessons, exams, labs, and dialogs with no clipped controls or page-level horizontal overflow. Check touch and keyboard interaction, focus, labels, status announcements, contrast, reduced motion, empty/loading/error states, and certificate output. Confirm that diagrams teach the concept and remain understandable without animation.

Check that nickname/avatar onboarding suffices, personal data is minimized, no public ranking or social feed is introduced, and errors/retries remain supportive. Examine requests and links relevant to the feature for unnecessary tracking or unsafe destinations.

## Container deployment

Use `.claude/skills/podman-compose-deployment/SKILL.md` from the project root to review deployment. Confirm every actual application service is containerized and included in the root Compose stack. Verify production builds, configuration/secrets handling, health and readiness, internal networking, and persistence for any server-side data. Check the deployment runbook against the commands and files that actually exist.

Verify the active Podman connection/machine and selected `podman-compose` provider, including support for the Compose features used. Validate Compose configuration, build the images, and exercise the stack and key learner flows through its published endpoint when Podman is available. Verify restart/recreation without losing required data; browser progress should survive when revisiting the same origin. A host-side development server does not demonstrate container deployment readiness. Report unavailable runtime checks explicitly.

## Section acceptance handoff

For a section completion review, assess the current section against its stated acceptance criteria and retain remaining course requirements as pending. Confirm the deployed service is accessible, give the real review URL, and provide a short checklist of actions and expected results for the user to test. Include checks already run and known limitations. Ask for functional feedback and explicit approval to proceed, then stop at the boundary specified in `CLAUDE.md`. Automated checks and this review do not substitute for user acceptance. Requested fixes stay in the current section and require a refreshed deployment and review before continuation.

## Report evidence

Run the available relevant lint, type, build, and behavioral checks; report exact commands and outcomes. If there is no application yet, say that product checks are not runnable and identify the missing implementation instead of reporting a pass.

For each finding, include severity, affected file/route/topic, source requirement, reproducible evidence, learner impact, and a concrete fix. Distinguish verified passes, failures, and untested items. Report full completion only when the section 15 criteria are supported by actual evidence; a green build or attractive homepage is insufficient.
