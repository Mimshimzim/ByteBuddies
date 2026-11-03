---
name: safe-learning-labs
description: Implement or repair interactive computer, Windows, file, security, networking, and algorithm simulations for children, with accessible practice and safe simulated state.
---

# Safe interactive learning labs

Read root `persian_kids_computer_learning_website_prompt.md`, particularly the relevant session in section 4 and sections 9–11. Inspect shared lab components and progress integration before implementing.

## Simulation contract

Every lab needs a Persian objective and instructions, initial state, supported actions, a meaningful success condition, corrective feedback explaining errors, and reset/retry controls. Clearly label simulated tools and output. Use local fixtures and virtual state; do not execute learner-entered commands, alter their device, inspect real files, register accounts, or send pretend messages.

Model state transitions explicitly so outcomes depend on learner actions. Validate actions such as moving a folder into itself or connecting incompatible ports. Prevent duplicate completion rewards when callbacks repeat, and report objective completion through the shared progress model rather than directly changing XP.

Support pointer, touch, and keyboard or equivalent on-screen controls. Explain where a simplified simulation differs from Windows or hardware. Keep risky real-world actions conceptual and direct learners to a trusted adult when appropriate.

## Required lab behavior

| Lab | Observable learning behavior |
| --- | --- |
| Computer assembly | Place components into valid locations and explain CPU, RAM, storage, motherboard, power, and peripherals. |
| Windows desktop | Open Start, folders, pretend settings, and applications; switch and close windows using simulated state. |
| Virtual file manager | Create, rename, copy, move, delete, restore, search, and organize virtual items; distinguish files/folders and apply taught naming rules. |
| File-type sorter | Match the source prompt's formats to appropriate uses/apps and explain why an extension cannot guarantee safety. |
| Shortcut trainer | Complete meaningful tasks using taught shortcuts or accessible alternatives; scope handlers to the lab and avoid trapping browser navigation. |
| Compression | Archive and extract virtual folders; distinguish ZIP/RAR concepts, WinRAR, and Windows ZIP support without requiring downloads. |
| Security detective | Identify evidence in fictional phishing messages/downloads, explain each clue, and choose a safe next action. |
| Ports and cables | Match compatible devices and ports; distinguish USB-C shape from USB version/capabilities. |
| Network builder | Connect devices, router, access point/switch, and cables into a valid model; explain missing or invalid links. |
| Command-line simulator | Allowlist `ipconfig`, `ping`, `hostname`, and optional `tracert`; return clearly simulated output and Persian guidance for unknown input. Never invoke a real shell or network request. |
| Algorithm challenge | Order steps to solve a task, trace the outcome, and explain why a sequence succeeds or fails. |

Include other guided simulations required by the lessons, such as composing pretend email, safe installation, conceptual partitions, Task Manager, and Wi-Fi connection. The 11 named labs are a minimum, not a substitute for topic-level practice.

For networking, use fictional devices and appropriate private/documentation addresses, never collect or display the learner's actual public IP. Use local illustrative message/download fixtures without real malicious links.

Verify a successful path, an incorrect action and its explanation, reset, repeated completion, and a keyboard-equivalent path. For persistent labs, verify restore separately from resetting an exercise; exercise reset must not silently erase course progress.
