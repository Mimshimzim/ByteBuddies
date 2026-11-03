---
name: mastery-progress
description: Implement assessment scoring, retries, concept review, mastery unlocking, XP, badges, local progress persistence, and earned certificates for this learning platform.
---

# Assessments and saved mastery

Read `docs/product-requirements.md` from the project root, sections 6–8 and 11–15. Inspect the curriculum IDs, prerequisites, current storage schema, and quiz implementation before editing.

## Assessment engine

Render one clear Persian question at a time with accessible controls and constructive reasoning after submission. Support the question kinds used by the actual content model, including practical challenges. Do not mark unimplemented question types correct by default.

Score by stable question and answer IDs, not display position. Shuffle only where it preserves the question's meaning, keeping answers and explanations aligned. Define partial credit explicitly when used. Keep question selection stable during an attempt and reject duplicate submissions.

Store each completed attempt's assessment ID, score, question/concept results, and completion time, plus best score, attempt count, weak concepts, and mastery. Use a configurable passing threshold; 80% is the prompt's example and a reasonable default if none exists. Compare unrounded scores to the threshold and round only for display.

Support unlimited low-pressure retries and relevant review. A later failed attempt must not silently revoke previously earned mastery. Do not clear useful feedback before the learner can read it.

## Progression and rewards

Represent prerequisites explicitly. Passing a core topic unlocks the next required step; passing each session checkpoint enables its milestone. Enrichment and older-learner bonus tasks must not block core completion. Validate references and detect circular prerequisites.

Course completion requires all core topics, all four checkpoints, and the practical capstone. Gate certificate eligibility with the same shared rule used by the completion UI, including on direct route access. Show which requirements remain in friendly Persian.

Award XP and badges for demonstrated learning and meaningful practice. Use stable completion/reward IDs so refreshing, retries, repeated callbacks, and revisiting completed screens do not repeatedly grant the same one-time reward. Keep practice reusable even when no new reward is due. Avoid leaderboards, shame, and streak pressure.

## Persistence

Prefer the repository's localStorage/IndexedDB approach for the MVP; authentication is optional. Persist only needed nickname/avatar, optional age band, and learning state. Keep domain calculations separate from storage/UI, with a versioned schema and validated IDs and score ranges.

Handle empty, malformed, older-version, unavailable, or full storage gracefully. Migrate supported records; discard only invalid portions when feasible and explain any recovery in Persian. For unsupported versions, avoid silently overwriting recoverable data. If persistence fails, allow in-memory learning and explain that progress may not be saved.

In server-rendered code, initialize browser storage on the client and avoid replacing saved progress with defaults before hydration completes. Define consistent handling for multiple tabs if concurrent updates are supported. A learner-requested full reset should clearly describe its effect and remain separate from resetting an individual exercise.

## Meaningful checks

Test exact threshold boundaries; stable answer identity after shuffle; repeated submit/reward calls; retry after failure and after mastery; locked-route access; optional-topic independence; missing checkpoint/capstone certificate denial; reload persistence; and malformed/unavailable storage. Cover these behaviors with focused tests or reproducible checks using the actual project tooling.
