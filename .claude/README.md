# Claude Code setup

This directory configures Claude Code for the project described in [`persian_kids_computer_learning_website_prompt.md`](../persian_kids_computer_learning_website_prompt.md). It contains instructions and skills; the website has not been implemented by this setup.

## Start

Open a terminal in the project root and run `claude` if Claude Code is installed and authenticated. Start a new session after adding the agent. Root [`CLAUDE.md`](../CLAUDE.md) supplies the shared project instructions.

Use `/agents` to inspect `persian-learning-builder`. To request implementation, send:

```text
Use the persian-learning-builder agent to implement the website described in persian_kids_computer_learning_website_prompt.md. Preserve all four sessions and track curriculum coverage.
```

For a smaller assignment:

```text
Use the persian-learning-builder agent to implement the virtual file manager with Persian instructions, keyboard controls, and simulated files.
```

## Project skills

Claude can select these skills when relevant. You can also invoke them directly:

| Command example | Purpose |
| --- | --- |
| `/persian-curriculum Author the RAM and storage topic for both age bands` | Persian lessons, questions, glossary, and curriculum coverage |
| `/persian-rtl-ui Review and fix mixed-direction text in the lesson player` | Persian RTL design and accessibility |
| `/safe-learning-labs Implement the network builder` | Safe functional simulations |
| `/mastery-progress Add checkpoint unlocking and saved exam attempts` | Scoring, mastery, rewards, and persistence |
| `/learning-platform-review Audit the current implementation against the master prompt` | Evidence-based product review |

Skills are in `skills/<name>/SKILL.md`; the agent is in `agents/persian-learning-builder.md`. The agent preloads the four implementation skills and reads the review skill for validation. Its model follows the active Claude session. This setup does not add permission overrides, hooks, API keys, or external service dependencies.

The master prompt remains the authoritative product specification. Update the corresponding guidance if product requirements change. Record actual app run/test commands in project documentation when an application exists; no app commands are assumed here.

## Format references

The setup follows the official Claude Code documentation for [project instructions](https://code.claude.com/docs/en/memory), [skills](https://code.claude.com/docs/en/skills), and [custom agents](https://code.claude.com/docs/en/sub-agents).
