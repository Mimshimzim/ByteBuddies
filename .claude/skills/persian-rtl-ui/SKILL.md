---
name: persian-rtl-ui
description: Build or refine Persian RTL screens, teaching visuals, responsive layouts, and accessible controls for the Computer Kids learning platform.
---

# Persian RTL learning UI

Read `docs/product-requirements.md` from the project root, sections 1–3, 6–7, 11–13. Inspect existing components and design tokens before introducing a visual system.

## Language and direction

- Set the document language to `fa` and direction to `rtl`. Use logical CSS properties for spacing, alignment, borders, and positioning.
- Isolate commands, file paths/extensions, keyboard shortcuts, URLs, email addresses, and IP addresses with appropriate `dir="ltr"`/`bdi` treatment. Check punctuation and parentheses in mixed sentences; do not reverse technical strings to make them look right.
- Use Vazirmatn or a suitable Persian font with reliable fallbacks. Keep text legible on small screens and support font-load failure.
- Localize buttons, navigation, dialogs, validation, empty/loading/error states, hints, chart labels, accessibility names, achievements, parent views, and print certificates. Inspect third-party components for English defaults.
- Display learner-facing numbers consistently using Persian locale formatting where appropriate, while preserving technical syntax in paths, commands, and addresses.

## Learning-centered design

Use a cohesive, cheerful identity that also respects older learners. Make the four-session learning map, current topic, next step, and mastery status understandable. Prefer diagrams and meaningful interactive scenes to decorative stock photos or repetitive cards. Use original or appropriately licensed assets with reliable loading.

Keep the lesson player focused on one learnable step. Make explanations, glossary help, practice, assessment, and review easy to locate. Mascot hints should assist without blocking controls or distracting from instruction. An optional older-learner panel must not be necessary to complete the younger path.

Support the requested home, onboarding, learning map, lesson player, practice lab, exams, profile, glossary/review, and completion screens. Treat the parent/teacher summary as optional unless requested. Preserve functional routing and actions when polishing the visuals.

## Accessibility and responsive behavior

- Use semantic landmarks, headings, labels, native controls, visible focus, and meaningful Persian names for icons.
- Make every drag interaction usable by keyboard or equivalent select-and-place controls; touch alone is insufficient.
- Keep focus predictable after dialogs, question submission, errors, and lesson navigation. Announce status changes without repeatedly interrupting reading.
- Provide large tap targets and adequate contrast. Do not communicate correctness, locked status, or progress only through color.
- Respect reduced motion. Pause or simplify teaching animations without hiding their explanation; provide equivalent static steps.
- Avoid automatic audio; provide text equivalents for instructional audio if used.
- Handle long Persian copy, mixed technical strings, zoom, small phones, tablets, and desktop widths without clipping or horizontal page overflow.

Inspect the rendered screens when browser tools are available, including one mixed-direction lesson, one assessment, and an interactive lab. Verify mobile, tablet, and desktop explicitly: representative viewport widths are 360, 768, and 1440 CSS pixels, plus intermediate sizes and tablet landscape. Choose layout breakpoints based on content, not device names. Check touch and keyboard operation, font fallback, reduced motion, and no clipped controls or page-level horizontal overflow. Record any visual checks that could not be performed.
