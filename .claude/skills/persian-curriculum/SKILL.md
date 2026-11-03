---
name: persian-curriculum
description: Author and revise Persian computer-fundamentals lessons, glossary entries, and assessment content for ages 7–14. Use for curriculum coverage and teaching content in this project.
---

# Persian curriculum authoring

Read `docs/product-requirements.md` from the project root, especially sections 2, 4–8, 10, and 12–15. Paths in these instructions are relative to the project root. Use existing content schemas; introduce typed structured data if implementation requires a new schema.

## Coverage and content structure

Keep the four sessions recognizable: computer introduction, files/storage, Windows security/system management, and networking. Map every numbered curriculum bullet to one or more fully authored topics in `docs/curriculum-coverage.md` when creating or revising the course. Include topic ID, source bullet, content location, practice/lab, assessment, and actual implementation status. Read the source bullets directly; a summary list cannot prove coverage.

Separate keyboard/mouse prerequisites and digital literacy, citizenship, computational thinking, algorithms, and programming enrichment from core progression. Offer a next-course path to Scratch and eventually Python without turning this course into a syntax course.

Each topic contains:

1. Persian title, friendly purpose, estimated duration, and 2–4 objectives.
2. A child-relevant reason to learn the concept.
3. Stepwise explanation and at least one useful visual; add an interactive demonstration when it improves understanding.
4. Guided safe practice with a clear task and educational outcome.
5. A recap and glossary entries.
6. A topic exam with reasoning feedback, review links, and a next-topic action governed by mastery.

Represent objectives, age-band explanations, steps, visuals, practice references, glossary IDs, questions, and prerequisites explicitly. Keep stable IDs independent of display titles. Avoid storing content inside route-specific components when it belongs in shared curriculum data.

## Persian teaching voice

For ages 7–10, use short sentences, familiar examples, and guided steps. For ages 11–14, retain the same essentials and add detail, independence, and optional «بیشتر بدانیم» material. Define terms before testing them, explain the limits of analogies, and avoid babyish or shaming language.

Write original Persian, using consistent Persian letters and natural spacing/half-spaces. Explain a concept in Persian before adding an educational English term in parentheses. Technical tokens such as RAM or `Ctrl+C` are legitimate; untranslated UI prose is not. Supply meaningful Persian visual descriptions and accessibility text.

## Assessment content

- Normally author 5–8 meaningful questions per topic and 10–15 per session checkpoint, including a practical challenge at each checkpoint.
- Mix multiple choice, explained true/false, matching, ordering, identification, and scenarios as appropriate. Include reasoning/application, not just recall.
- Use stable answer IDs, plausible distractors, the correct response, and explanations for right and wrong choices. Associate questions with objective/concept IDs so errors lead to relevant review.
- Teach everything tested. Avoid ambiguous questions, answer-position clues, and trivial rewordings presented as variety.
- Cover all four domains in the capstone: components, files, security, and networking. Its practical tasks must demonstrate understanding.

## Accuracy and safety

Distinguish RAM from persistent storage, files from applications, connector shape from USB capabilities, the local network from the Internet, and router/switch/modem/DNS roles. Do not promise speeds based only on connector color or wired/wireless labels. Explain that file extensions do not prove safety.

Use pretend email/account creation, installation, disk tools, and networking examples. Never ask for a real password, public IP, or child account registration. Check current official sources when teaching version-dependent Windows behavior, provider eligibility, or download sources; keep source notes in developer content rather than overwhelming lessons.

Review the authored topic against its source bullet, objectives, two age bands, practice, glossary, and exam before marking its coverage complete.
