# Master Prompt — Persian Computer Fundamentals Learning Platform for Ages 7–14

## 1. Your Role and Mission

Act as a **senior educational product designer, child-centered UX/UI designer, Persian instructional designer, gamification specialist, and full-stack web engineer**.

**Build a complete, beautiful, functional, interactive educational website** that teaches computer fundamentals to children and early teenagers aged **7–14**, starting from zero knowledge and preparing them to begin learning programming after finishing the course.

The finished product must be **a working learning experience, not just a landing page, dashboard mockup, static prototype, or collection of lesson titles**. Create meaningful Persian learning materials, interactive teaching tools, and working assessments throughout the curriculum.

### Non-negotiable language requirement

**100% of learner-facing website content must be in natural, clear, age-appropriate Persian (فارسی)**. This includes navigation, lessons, buttons, tooltips, dialogue, quizzes, answers, feedback, notifications, badges, achievements, certificates, parent/teacher views, accessibility labels, and error messages. Layout must be **right-to-left (RTL)**, with correct alignment, Persian typography, and appropriate bidirectional handling of English technical terms, commands, URLs, emails, and file extensions. The instructions in this development prompt may be in English, but the website itself must be in Persian. Do not use English filler text, lorem ipsum, or untranslated UI components.

## 2. Audience and Teaching Philosophy

- **Beginners aged 7–10:** short sentences, familiar analogies, playful visuals, guided interactions, more illustrations and spoken/text support, smaller lesson units.
- **Learners aged 11–14:** richer technical detail, more realistic examples, optional deeper explanations, slightly harder exercises, independent challenges.
- Let learners select an age band or difficulty preference and adjust the presentation accordingly. Both paths must teach the same essential concepts correctly.
- Assume **no prior computer knowledge**. Define every new concept before requiring it.
- Teach through the sequence: **discover → explain → see → try → practice → quiz → review → unlock**.
- Break complex concepts into digestible micro-lessons. Use analogies, but explicitly explain where analogies stop being accurate.
- Emphasize understanding, exploration, digital citizenship, independent problem-solving, and readiness for beginner programming.
- Provide a **simple Persian glossary** for each module and a searchable cumulative glossary.

## 3. Visual Design and User Experience

Create a premium, original educational design that feels like a polished modern learning game rather than a school PDF or generic admin dashboard.

### Design direction

- Cheerful, modern, friendly, and age-appropriate for both younger children and teenagers; avoid a babyish design.
- A cohesive visual identity, delightful illustrated mascots/characters, playful progress maps, soft depth, expressive iconography, and a memorable color palette.
- High-quality visual storytelling: **original diagrams, custom SVG illustrations, clear component cutaways, tasteful motion, interactive scenes, and suitable licensed or original imagery**. Use visuals to teach, not just decorate.
- Visuals should explain concepts such as the CPU, RAM, hard drive/SSD, motherboard, USB ports, file trees, network topology, IP addresses, and the flow of a web request.
- Use a professional Persian-friendly font such as **Vazirmatn**, with reliable fallback fonts.
- Consistent spacing, accessible contrast, large tap targets, intuitive icons, and responsive layouts for desktop, tablet, and phone.
- Micro-animations and transitions should be purposeful, lightweight, and respect reduced-motion preferences.
- Provide loading, empty, completed, incorrect-answer, retry, and offline/error states where relevant.
- No stock-photo-heavy hero pages, broken image URLs, low-resolution diagrams, placeholder graphics, or repetitive card-only layouts.

### Core UI sections

1. **Home:** friendly introduction, learning benefits, curriculum preview, mascot, and a prominent “شروع یادگیری” action.
2. **Learner onboarding:** nickname/avatar selection, optional age range, initial guide, and clear privacy-friendly flow.
3. **Learning map:** four main sessions visualized as journeys/worlds with distinct icons, progress, unlock states, and optional enrichment tracks.
4. **Lesson player:** a focused, step-by-step learning interface with illustrated explanations, glossary terms, simulations, practice, and a quiz.
5. **Practice lab:** a safe simulated environment for trying Windows, files, keyboard shortcuts, networking, and related concepts without changing the learner's device.
6. **Quiz and exam experience:** interactive multiple-choice, matching, sequencing, identification, and scenario-based questions with helpful feedback.
7. **Profile and achievements:** earned XP, badges, completed topics, attempts, recent progress, learning streaks (without pressure), and collectible milestones.
8. **Glossary and review center:** categorized searchable terms, quick revision, and practice for topics needing reinforcement.
9. **Parent/teacher area (optional but desirable):** read-only learning progress summaries, strengths, topics needing practice, and suggested offline exercises.
10. **Completion celebration:** earned certificate and clear next-step learning roadmap.

## 4. Complete Required Curriculum

Organize the learning experience around the **four required sessions** below. Every bullet must become one or more **fully developed instructional topics**, not just a heading or a brief paragraph. You may split a session into multiple short lessons to keep the experience manageable.

### Session 1 — Introduction to Computers (جلسه ۱: آشنایی با رایانه)

1. What a computer is, why people use it, and examples in everyday life.
2. Input → processing → output → storage: how computers work, with interactive examples.
3. Hardware versus software; examples and a sorting mini-game.
4. Inside the computer: CPU, RAM, HDD, SSD, motherboard, power supply, and peripherals. Explain what each does, how components cooperate, and the difference between temporary and permanent storage.
5. Operating systems: what they do and why we need them; Windows as the primary example.
6. Navigating Windows: desktop, Start menu, taskbar, windows, opening/closing apps, basic mouse/keyboard use.
7. Email fundamentals: what an email address is, inbox, subject, attachments, and good email manners. Teach the **concept and steps** for creating an email account using a safe illustrated walkthrough; explain age limits and the need for a parent/guardian where applicable. Never require a child to register a real email account to complete the course.

**Suggested interactions:** assemble a computer, match each component to its function, trace data through a simple computer, explore a simulated Windows desktop, and compose a pretend email.

### Session 2 — File Management and Storage (جلسه ۲: فایل‌ها و ذخیره‌سازی)

1. Review software concepts and explain where data is stored.
2. Storage devices: HDD, SSD, USB flash drive, memory card, and cloud storage in age-appropriate terms.
3. Files, folders, directories, paths, and the difference between files and applications.
4. Creating, renaming, copying, moving, deleting, restoring, and searching for files/folders in Windows.
5. What a drive and partition are; C: and D: as examples. Explain partitioning **conceptually** with diagrams; do not ask children to modify real disk partitions.
6. Windows file and folder naming rules, invalid characters, useful naming conventions, and file extensions.
7. Essential Windows keyboard shortcuts: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z, Ctrl+A, Ctrl+S, Alt+Tab, Win+E, Win+D, and other age-appropriate shortcuts.
8. Compression and extraction: ZIP/RAR concepts and the purpose of WinRAR; demonstrate extraction using a **simulation**, and also explain Windows built-in ZIP functionality. Avoid suggesting untrusted downloads.
9. Common file formats: images (JPG, PNG), audio (MP3, WAV), video (MP4), documents (PDF, DOCX, TXT), presentations (PPTX), and spreadsheets (XLSX).
10. Basic organization, backups, safe handling of USB drives, and why file extensions do not always guarantee file safety.

**Suggested interactions:** drag and drop a virtual file tree, organize a messy desktop, choose appropriate file formats, keyboard-shortcut challenges, and compress/extract simulated folders.

### Session 3 — Windows Security and System Management (جلسه ۳: امنیت و مدیریت ویندوز)

1. Viruses, malware, phishing, suspicious links/attachments, and safe browsing.
2. Security software, Windows Security/Microsoft Defender, Windows Update, backups, and strong passwords/passphrases.
3. Personal information, privacy, respectful online communication, and what to do if something suspicious happens (ask a trusted adult).
4. Computer ports and connectors: USB 2.0, USB 3.x, USB-C, VGA, HDMI, audio, and Ethernet. Explain that USB-C describes a connector shape, while USB versions describe capabilities; avoid oversimplified or inaccurate speed claims.
5. Downloading and installing essential Windows applications from trusted, official sources: verification, permissions, and safe uninstalling. Use safe walkthroughs rather than requiring real installation.
6. Windows system utilities: Task Manager, Disk Management, Computer Management, Settings, and Device Manager; distinguish safe observation from risky system changes.
7. Basic troubleshooting: frozen application, no sound, storage getting full, and inability to connect to Wi-Fi.
8. Dedicated question-and-answer review session, with common learner questions and clear answers.

**Suggested interactions:** spot phishing clues, identify a safe installer, match ports with cables, explore a simulated Task Manager, and choose the safest troubleshooting step.

### Session 4 — Computer Networking Fundamentals (جلسه ۴: مبانی شبکه و اینترنت)

1. What a computer network is and the difference between a local network and the Internet.
2. Connecting Windows to the Internet using Wi-Fi or Ethernet, with a simulated step-by-step guide.
3. Network adapters: Ethernet and Wi-Fi adapters, basic settings, and how to identify a connected adapter.
4. Essential introductory Windows network commands, demonstrated safely: `ipconfig`, `ping`, `hostname`, and optionally `tracert`. Explain each command's purpose with real-looking, **clearly simulated** output. Do not encourage risky configuration changes.
5. Ethernet cables and connectors; a simple explanation of what cables do and how wired devices connect to routers/switches.
6. Wired versus wireless networks: speed, convenience, interference, security, and practical differences without blanket promises.
7. IP addresses: a friendly analogy, IPv4 examples, local versus public addresses at a beginner level, and how to find a device's local IP in Windows.
8. Router, switch, modem, Wi-Fi, and DNS: what each does through easy visual examples.
9. What happens when a learner opens a website: browser → network → server → response, with an animated journey.
10. Basic Internet troubleshooting and safe public Wi-Fi habits.

**Suggested interactions:** build a home network using drag-and-drop, connect devices to a pretend router, simulate `ping` and `ipconfig`, identify local IP addresses, and follow a website request across a network.

## 5. Additional Topics You Should Add

Add appropriate optional or integrated lessons that close important gaps and help learners become ready for programming:

- **Keyboard and mouse confidence:** typing, scrolling, selecting, shortcuts, and touchpad basics.
- **Web and digital literacy:** browser tabs, search engines, effective searching, evaluating sources, advertisements versus search results, and misinformation.
- **Digital safety and citizenship:** privacy, cyberbullying awareness, permissions, respectful communication, and asking a trusted adult for help.
- **Problem-solving and computational thinking:** decomposition, patterns, step-by-step instructions, sequences, logic, and debugging using unplugged and on-screen games.
- **Algorithms and flowcharts:** intuitive introductions with stories and interactive puzzles.
- **What programming is:** commands, conditions, loops, events, and variables introduced through simple visual examples, not full syntax-heavy lessons.
- **First programming pathway:** explain beginner-friendly next steps such as Scratch or block-based programming, followed by Python when appropriate. This is an invitation to the next course, not a replacement for the core computer-fundamentals curriculum.

Label enrichment or prerequisite materials clearly and integrate them without obscuring the four original sessions.

## 6. Detailed Lesson Format

**Each instructional topic must use the following learning structure:**

1. **Title and purpose** in Persian, with a friendly one-sentence description.
2. **Learning objectives** (2–4) phrased simply.
3. **Why it matters** using a child-relevant everyday example.
4. **Step-by-step instructional explanation** with correct technical information and at least one helpful illustration/animation/diagram.
5. **Interactive demonstration or mini-simulation** wherever the topic benefits from it.
6. **Guided hands-on activity** with safe instructions and/or a virtual practice environment.
7. **Quick recap** of key points and glossary terms.
8. **End-of-topic exam**, not merely an optional quiz or a single end-of-session exam.
9. **Constructive answer feedback** explaining why an answer is right or wrong.
10. **Review and next-topic action** after successful completion.

Show estimated lesson duration and completion status. Add an optional “بیشتر بدانیم” panel for older or curious students. Make examples, instructions, and explanations fully authored in Persian; no placeholder text.

## 7. Gamification and Motivation

Design a real learning loop, not cosmetic badges:

- **XP:** award points for completing lessons, practicing skills, and demonstrating understanding; avoid rewarding mindless repeated clicks.
- **Progress map:** visually track unlocked and completed topics, sessions, and optional challenges.
- **Achievements:** topic-relevant badges, such as hardware explorer, folder organizer, online safety hero, and network detective, with creative Persian names.
- **Challenges:** small missions tied directly to lesson objectives (e.g., rescue a messy folder, fix a pretend Wi-Fi setup, protect a simulated inbox).
- **Mascot companion:** offers hints, encouragement, and short contextual explanations without becoming distracting.
- **Positive reinforcement:** use friendly language and celebrate learning; never shame incorrect answers.
- **Retry and mastery:** learners can retry questions, see why an answer is incorrect, and review weak concepts before proceeding.
- **Optional bonus goals:** advanced challenges for ages 11–14; ensure they do not block younger learners.
- **Session milestones:** mini certificates or themed celebrations after each session, plus a final course certificate.
- Prefer **intrinsic motivation and mastery** over competitive leaderboards, streak anxiety, manipulative rewards, or social pressure.

## 8. Assessments and Mastery Rules

**Every topic must end with an assessment.** Also include a larger checkpoint exam after each of the four sessions, and a final capstone.

### End-of-topic assessment

- Typically **5–8 meaningful questions** drawn from the topic content.
- Mix multiple-choice, true/false with explanations, drag-and-drop matching, ordering, image identification, and practical scenarios.
- At least some questions should test **application or reasoning**, not memorized definitions.
- Present one clear question at a time, with accessible interactions.
- Explain the correct reasoning after submission; show a helpful hint or relevant review link for errors.
- Record score, best attempt, attempts, incorrect concepts, and mastery status.
- Set a clear passing threshold (for example, **80%**); support unlimited low-pressure retries and avoid trapping students behind confusing questions.
- Do not repeatedly show the exact same question order if a question pool is available.

### Session and final exams

- **End-of-session:** approximately 10–15 varied questions combining topics in that session, including at least one practical challenge.
- **Final capstone:** learners complete a friendly mission involving recognizing components, organizing files, spotting a security threat, and connecting devices/network concepts.
- Final completion requires passing all core topics and the four session checkpoints, followed by the capstone.
- Show progress and explain what to review; never expose sensitive personal information or publicly rank children.

### Real assessment content

Write actual Persian question stems, plausible distractors, correct answers, and useful answer explanations. Do not use placeholder entries such as “Question 1” or “Option A”. Make the assessment data consistent with the instructional material and technically accurate.

## 9. Interactive Learning Labs

Implement at least these working interactions, using browser-based simulations where necessary:

1. **Computer assembly lab:** drag components into appropriate locations and explain each role.
2. **Windows desktop simulator:** open the Start menu, folders, a pretend settings window, and switch applications.
3. **Virtual file manager:** create, rename, copy, move, and organize simulated files; give feedback on mistakes.
4. **File-type sorter:** recognize common file extensions and choose the right application.
5. **Keyboard shortcuts trainer:** perform tasks using keyboard or accessible on-screen alternatives.
6. **Compression simulator:** show how compression/archive extraction works without accessing real user files.
7. **Security detective:** examine simulated messages and downloads for scams/malware indicators.
8. **Ports and cables matching game:** connect appropriate devices to ports.
9. **Network builder:** drag routers, computers, access points, and cables into a simple valid network.
10. **Command-line simulator:** safely explore `ipconfig`, `ping`, and related output; clearly label as a simulation.
11. **Algorithm challenge:** order actions to solve a simple task, leading into programming concepts.

Interactions must be keyboard accessible or provide an equivalent control. Provide clear instructions, reset/retry controls, success/failure feedback, and educational explanations.

## 10. Content Accuracy and Child Safety

- Ensure definitions, hardware descriptions, storage comparisons, security recommendations, shortcuts, Windows features, and network concepts are accurate and understandable.
- Reference a modern version of Windows in examples, but avoid hard-coded assumptions that break on another version. When a step differs by Windows version, note this simply.
- Never instruct children to run destructive disk commands, format drives, disable security settings, download malware, change sensitive system settings, or expose their public IP/personal data.
- Distinguish **simulated actions** from real operations, particularly for email registration, partitioning, application installation, security settings, and system tools.
- Keep any account-creation demonstration optional and age-safe; children may need guardian permission or provider-specific minimum age eligibility.
- Avoid advertisements, commercial profiling, manipulative monetization, public chat, user-generated social feeds, or external links not relevant to safe learning.
- Minimize personal data collection. Prefer a nickname and avatar. Avoid requiring real names, birthdays, email addresses, or passwords for the basic learning experience.

## 11. Functional and Technical Requirements

Build the actual website and its interactions. Choose a modern, maintainable stack suited to the execution environment. **If a stack can be chosen freely, prefer Next.js + React + TypeScript + Tailwind CSS**, with reusable components, sensible data models, and lightweight animation. Avoid unnecessary complexity.

### Architecture

- Content-driven curriculum: define sessions, topics, lesson steps, question banks, glossary entries, and achievements as structured typed data, separate from UI components.
- Reusable lesson renderer, quiz engine, progress tracker, badge logic, and simulation components.
- Responsive mobile-first styling with reliable desktop support.
- Full RTL support through the document direction and component-level layout, while preserving LTR for commands, file paths, email addresses, and technical strings.
- Persist progress, XP, completed assessments, attempts, and unlocked lessons with **localStorage or IndexedDB** in an MVP. Persist safely and recover gracefully if storage is unavailable.
- If authentication/backend is introduced, make it optional, privacy-conscious, and appropriate for minors; the website must remain usable without providing personally identifying details.
- Use semantic HTML, accessible labels, proper focus behavior, and screen-reader-friendly status messages.
- Aim for strong performance: optimized assets, appropriate loading strategies, minimal cumulative layout shift, and comfortable interactions on low-end devices.
- Ensure all navigation, buttons, lessons, labs, exam flows, score calculation, unlock rules, progress persistence, and completion certificates work end to end.
- Ensure no broken routes, empty screens, placeholder lessons, untranslated interface text, or fake buttons.

### Docker and Docker Compose deployment

- **Containerize all application services and deploy through Docker Compose.** This includes the web app and any API, worker, or supporting service actually introduced. A single web container is sufficient for the browser-storage MVP; do not add a backend or database solely to use Compose.
- Supply production Dockerfiles for application code, appropriate `.dockerignore` files, and a root `compose.yaml`. Use trusted versioned images for supporting services. Keep development-only settings in an optional separate Compose override.
- Use reproducible dependency installation from lockfiles, multi-stage builds where applicable, minimal runtime artifacts, and non-root application processes. Production must run built artifacts without source bind mounts or development servers.
- Document build-time versus runtime configuration and provide an `.env.example` without credentials. Keep secrets out of committed files, image layers, build arguments, and browser bundles; inject them through appropriate deployment configuration or secret mounts.
- Configure health checks, readiness-aware dependencies where needed, restart behavior, internal service networking, and only necessary published ports. Preserve any server-side data in named volumes with backup/restore guidance. Browser localStorage/IndexedDB remains on the learner's device.
- Supply `docs/deployment.md` with prerequisites, configuration, exact Compose build/start commands, health verification, logs, updates, rollback, and non-destructive shutdown instructions. Document ingress/TLS for the chosen deployment target when one is provided.
- Validate the resolved Compose configuration, build all application images, start the full stack, and smoke-test learner flows against the containerized app. Check restart/recreation and persistence. Report unavailable Docker execution as unverified, not a successful deployment.

### Quality assurance

Include automated or easily reproducible checks for:

- Persian and RTL rendering, including mixed Persian/English technical content.
- Lesson navigation and lesson completion.
- Correct exam scoring and pass/fail feedback.
- Retry behavior and mastery unlocking.
- Progress persistence after page refresh.
- Interactive lab success and failure states.
- Mobile and desktop layouts.
- Keyboard navigation, reduced-motion preference, and adequate contrast.
- Docker image builds, Compose configuration and health, containerized learner flows, and persistence across container recreation where applicable.

## 12. Sample Persian Voice and Educational Style

Use engaging Persian instructional copy such as:

> «تا حالا فکر کردی وقتی روی یک بازی کلیک می‌کنی، رایانه چطور می‌فهمه باید چی کار کنه؟ بیا با هم سفر یک دستور را داخل رایانه ببینیم!»

> «آفرین! حالا می‌دونی حافظهٔ RAM برای نگهداری موقت اطلاعات استفاده می‌شه. اگر بخوای فایلت بعد از خاموش شدن رایانه هم باقی بمونه، کجا باید ذخیره‌اش کنی؟»

> «اشتباه کردن بخشی از یادگیریه. یک‌بار دیگه شکل را نگاه کن: کدوم قطعه بیشتر کارِ پردازش دستورها را انجام می‌ده؟»

These are tone examples only. **Create original, varied Persian explanations and question content for the full course**, appropriate to the chosen age range. Prefer familiar, everyday examples over unnecessary jargon. When introducing an English technical term, provide the Persian explanation first, and then the original term in parentheses when educationally helpful.

## 13. Recommended User Flow

1. Learner visits the attractive homepage.
2. Learner chooses an avatar/nickname and an age band (without mandatory registration).
3. Learner sees an interactive map of sessions and topics.
4. Learner enters a topic, studies short illustrated steps, and performs hands-on activities.
5. Learner completes **that topic's exam** and receives understandable feedback.
6. Passing unlocks the next core topic; missing concepts link directly to review material.
7. At the end of a session, the learner takes a mixed checkpoint exam and earns a badge.
8. After all four sessions, the learner completes the capstone challenge and receives a Persian completion certificate.
9. The final screen presents a clear next-step roadmap into Scratch, computational thinking, and later Python.

## 14. Delivery Requirements and Priority Order

**Priority 1: Real Persian educational content.** Every required session and topic must be represented by substantial, accurate, pedagogically useful Persian instruction.

**Priority 2: Working learning functionality.** Topic exams, feedback, scoring, retries, progression, persistence, and interactive tasks must function; not just look interactive.

**Priority 3: High-quality design.** Illustrations and animation should support learning, with a unified polished experience across devices.

**Priority 4: Extensibility.** The course should be structured so educators can add lessons, quizzes, simulations, or a follow-up programming course without rewriting the entire app.

If implementation constraints force staged development, first establish a complete, navigable, content-rich course with working quizzes for **every topic**. Then enrich the highest-value topics with more sophisticated simulations and visuals. Do not silently reduce the curriculum to the first session or replace entire lessons with placeholder cards.

### Section-by-section delivery and acceptance

Implement the product in meaningful, reviewable sections with observable acceptance criteria. Announce the section plan and begin the first section within the requested scope. Complete routine changes and fixes inside a section without asking for approval after every small change.

After each section, deploy the current app using Docker Compose, verify the service, and provide the actual review URL plus a short functionality checklist with expected outcomes. Keep the review service available and ask the user to test it and explicitly approve moving forward. Do not start the next section until that approval arrives; passing automated checks or receiving no response is not approval. If the user requests changes, fix the current section, retest, redeploy, and request review again.

Track the current section, deployed revision/URL, feedback, and explicit approvals in `docs/implementation-progress.md` during implementation. If deployment or user access is blocked, explain the blocker and resolve it before treating the section as ready. This delivery cadence preserves the full curriculum and final acceptance criteria; approval of an early section is not completion of the whole product.

## 15. Definition of Done / Acceptance Criteria

The website is complete when all the following are true:

- [ ] The entire learner-facing experience is in **Persian** and correctly uses **RTL**.
- [ ] It addresses absolute beginners aged **7–14**, with age-appropriate explanations.
- [ ] All **four required sessions** and their full topic coverage are available.
- [ ] Supplementary digital literacy and computational-thinking content prepares learners for programming.
- [ ] Every topic includes meaningful instructional content, useful visuals, hands-on practice, and **a working exam**.
- [ ] Each of the four sessions includes a checkpoint exam.
- [ ] A final practical capstone and completion certificate exist.
- [ ] Progress, XP, mastery, badges, and unlocking work and persist after a refresh.
- [ ] The computer, Windows, file-management, security, and networking interactive experiences are functional.
- [ ] High-quality responsive design works on desktop, tablet, and mobile.
- [ ] All application services run in Docker, deployment uses Docker Compose, and configuration, health checks, persistence, updates, and rollback are documented and verified.
- [ ] Accessibility and age-appropriate safety/privacy are handled thoughtfully.
- [ ] The site is free of mockup-only buttons, filler content, broken links, and untranslated UI labels.
- [ ] Students who finish the course understand core computer concepts and are ready to start a beginner programming track.

**Now design and implement this complete educational website with the above requirements. Prioritize authentic Persian teaching quality, real interactivity, high usability, and an exciting child-friendly learning experience.**
