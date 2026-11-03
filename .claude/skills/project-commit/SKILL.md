---
name: project-commit
description: Prepare and create ByteBuddies Git commits with short messages and the configured user identity. Use when the user requests a commit or an authorized workflow includes committing changes.
---

# Project commits

Use a short, specific commit subject describing the main change, preferably under 60 characters and no more than 72. Use an imperative verb, such as `Add CMS lesson publishing` or `Fix lesson progress restore`. Avoid vague messages such as `Update files`. Omit a body for straightforward changes; add brief context only when necessary.

## Identity

Create commits with both author and committer set to:

- Name: `mimshimzim`
- Email: `mimshimzim@gmail.com`

Prefer repository-local configuration or command-scoped identity settings; do not change global Git configuration. Account for environment variables that may override Git config. Verify the resulting author and committer after committing. Do not rewrite existing commits solely to change their identity unless the user requests it.

## Workflow

1. Inspect the branch, status, staged changes, and unstaged diff. Preserve existing user changes and include only the requested commit scope. Stage explicit paths or hunks when unrelated work exists.
2. Run relevant checks and `git diff --cached --check`. Reuse still-valid verification from the current task; do not claim unrun checks passed. Never bypass hooks to hide failures.
3. Verify the intended identity and create the commit with the short subject. If nothing is staged, report that there is nothing to commit instead of creating an empty commit.
4. Verify with `git log -1 --format='%h %s%nAuthor: %an <%ae>%nCommitter: %cn <%ce>'` and inspect working-tree status. Report the hash and any remaining changes accurately.

A request to create or update this skill does not itself request a commit. When a commit is already requested, proceed without another permission question beyond required tool approvals. Follow existing section-review gates; a commit does not count as user acceptance of a section.

Push only when requested or already authorized for the task. Check the actual branch and remote, use a normal push, and preserve remote history. A commit-only request does not automatically request a push, amend, rebase, or force-push.
