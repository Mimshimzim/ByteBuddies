# Curriculum coverage

Maps every bullet of spec section 4 (and the section 5 additions) to topic IDs, content files, practice and assessments.
Status values: **Done** = authored, assessed and checked by `tests/content-integrity.test.ts`; **Planned — section N** = not yet authored.

Exams: topic exam id = `exam-<topicId>` (pool 9–10 questions, draw 6, pass 80 %); checkpoint ids `checkpoint-s1` … `checkpoint-s4`; capstone `capstone`.

## Session 1 — آشنایی با رایانه (content: `src/content/session1.ts` + `src/content/session1/*`)

| Bullet | Spec item | Topic ID | Lab / practice | Exam | Status |
| --- | --- | --- | --- | --- | --- |
| s1.1 | What a computer is, why used, everyday examples | `s1-t1-what-is-computer` | Offline "device hunt" activity | `exam-s1-t1-what-is-computer` | Done |
| s1.2 | Input → processing → output → storage, interactive examples | `s1-t2-how-computers-work` | Guided trace of keypress / photo / song (diagram `input-process-output-storage`) | `exam-s1-t2-how-computers-work` | Done |
| s1.3 | Hardware vs software; sorting mini-game | `s1-t3-hardware-software` | Paper two-column sorting game (self-check list) + match question | `exam-s1-t3-hardware-software` | Done (see gap 1) |
| s1.4 | CPU, RAM, HDD, SSD, motherboard, PSU, peripherals; temporary vs permanent storage | `s1-t4-inside-computer` | Lab `computer-assembly` | `exam-s1-t4-inside-computer` | Done |
| s1.5 | Operating systems; Windows as example | `s1-t5-operating-system` | Layer trace (diagram `os-layers`) + offline OS hunt | `exam-s1-t5-operating-system` | Done |
| s1.6 | Navigating Windows: desktop, Start, taskbar, windows, mouse/keyboard | `s1-t6-navigating-windows` | Lab `windows-desktop` (8 missions) | `exam-s1-t6-navigating-windows` | Done |
| s1.7 | Email: address, inbox, subject, attachments, manners; safe account-creation walkthrough with age limits and guardian | `s1-t7-email` | Pretend email composer inside lab `windows-desktop` (no real account) | `exam-s1-t7-email` | Done |
| — | Session 1 checkpoint (24-question pool, draw 12, includes practical scenario) | all s1 topics | — | `checkpoint-s1` | Done |

Session 1 extras: 57 glossary terms, 14 achievements (badge `badge-s1`).

## Session 2 — فایل‌ها و ذخیره‌سازی

| Bullet | Spec item | Topic ID | Content file | Lab / practice | Exam | Status |
| --- | --- | --- | --- | --- | --- | --- |
| s2.1 | Software review, where data is stored | — | `src/content/session2.ts` | — | — | Planned — section 2 |
| s2.2 | HDD, SSD, USB flash, memory card, cloud | — | `session2.ts` | — | — | Planned — section 2 |
| s2.3 | Files, folders, directories, paths; files vs applications | — | `session2.ts` | `file-manager` | — | Planned — section 2 |
| s2.4 | Create/rename/copy/move/delete/restore/search | — | `session2.ts` | `file-manager` | — | Planned — section 2 |
| s2.5 | Drives and partitions (conceptual, C:/D:) | — | `session2.ts` | diagram only | — | Planned — section 2 |
| s2.6 | Naming rules, invalid characters, extensions | — | `session2.ts` | `file-manager` | — | Planned — section 2 |
| s2.7 | Keyboard shortcuts | — | `session2.ts` | `shortcuts-trainer` | — | Planned — section 2 |
| s2.8 | Compression/extraction, ZIP/RAR, WinRAR | — | `session2.ts` | `compression-sim` | — | Planned — section 2 |
| s2.9 | Common file formats | — | `session2.ts` | `file-type-sorter` | — | Planned — section 2 |
| s2.10 | Organization, backups, safe USB, extensions vs safety | — | `session2.ts` | `file-type-sorter` | — | Planned — section 2 |
| — | Checkpoint | — | `session2.ts` | — | `checkpoint-s2` | Planned — section 2 |

## Session 3 — امنیت و مدیریت ویندوز

| Bullet | Spec item | Topic ID | Content file | Lab / practice | Exam | Status |
| --- | --- | --- | --- | --- | --- | --- |
| s3.1 | Viruses, malware, phishing, safe browsing | — | `src/content/session3.ts` | `security-detective` | — | Planned — section 3 |
| s3.2 | Security software, Defender, updates, backups, passwords | — | `session3.ts` | — | — | Planned — section 3 |
| s3.3 | Personal info, privacy, respectful communication, trusted adult | — | `session3.ts` | — | — | Planned — section 3 |
| s3.4 | Ports and connectors (USB versions vs USB-C shape) | — | `session3.ts` | `ports-matching` | — | Planned — section 3 |
| s3.5 | Downloading/installing from trusted sources, uninstalling (simulated) | — | `session3.ts` | simulated installer | — | Planned — section 3 |
| s3.6 | System utilities: Task Manager, Disk Management, Computer Management, Settings, Device Manager | — | `session3.ts` | simulated Task Manager | — | Planned — section 3 |
| s3.7 | Basic troubleshooting | — | `session3.ts` | scenario practice | — | Planned — section 3 |
| s3.8 | Q&A review session | — | `session3.ts` | — | — | Planned — section 3 |
| — | Checkpoint | — | `session3.ts` | — | `checkpoint-s3` | Planned — section 3 |

## Session 4 — مبانی شبکه و اینترنت

| Bullet | Spec item | Topic ID | Content file | Lab / practice | Exam | Status |
| --- | --- | --- | --- | --- | --- | --- |
| s4.1 | Network, LAN vs Internet | — | `src/content/session4.ts` | — | — | Planned — section 4 |
| s4.2 | Connecting Windows via Wi-Fi/Ethernet (simulated) | — | `session4.ts` | simulated Wi-Fi guide | — | Planned — section 4 |
| s4.3 | Network adapters | — | `session4.ts` | — | — | Planned — section 4 |
| s4.4 | ipconfig, ping, hostname, tracert (simulated) | — | `session4.ts` | `command-line` | — | Planned — section 4 |
| s4.5 | Ethernet cables and connectors | — | `session4.ts` | `network-builder` | — | Planned — section 4 |
| s4.6 | Wired vs wireless | — | `session4.ts` | — | — | Planned — section 4 |
| s4.7 | IP addresses, local vs public | — | `session4.ts` | `command-line` | — | Planned — section 4 |
| s4.8 | Router, switch, modem, Wi-Fi, DNS | — | `session4.ts` | `network-builder` | — | Planned — section 4 |
| s4.9 | What happens when opening a website | — | `session4.ts` | animated journey | — | Planned — section 4 |
| s4.10 | Internet troubleshooting, safe public Wi-Fi | — | `session4.ts` | scenario practice | — | Planned — section 4 |
| — | Checkpoint | — | `session4.ts` | — | `checkpoint-s4` | Planned — section 4 |

## Section 5 additions (enrichment) and capstone

| Item | Planned topic | Lab | Status |
| --- | --- | --- | --- |
| Keyboard and mouse confidence (typing, scrolling, touchpad) | enrichment | — | Planned — later section (basic mouse/keyboard is already covered in `s1-t6-navigating-windows`) |
| Web and digital literacy | enrichment | — | Planned — later section |
| Digital safety and citizenship | enrichment (partly s3.3) | — | Planned — later section |
| Computational thinking, algorithms, flowcharts | enrichment | `algorithm-challenge` | Planned — later section |
| What programming is | enrichment | — | Planned — later section |
| First programming pathway (Scratch, then Python) | enrichment / certificate page | — | Planned — later section |
| Final capstone and certificate | `capstone` | — | Planned — final section |

## Known gaps (Session 1)

1. s1.3 asks for a sorting mini-game. The `LabId` union in `src/lib/types.ts` has no hardware/software sorter, so the practice is a paper activity plus a graded match question. Needs a lead decision (extra `LabId`) or a UI-side widget.
2. s1.2 "interactive examples": the step is a guided trace with diagram `input-process-output-storage`; there is no separate trace-the-data lab (no matching `LabId`). The UI engineer's diagram may animate it.
3. Lab labels, diagrams and mascot behavior depend on the UI engineer; diagram keys used are listed in the engineering report.
4. Persian copy has not had native-speaker proofreading; a review pass is recommended.
5. Version-dependent Windows details (Start menu position, language-switch shortcut, provider minimum age) are worded generically on purpose; verify against current official sources before final release.
