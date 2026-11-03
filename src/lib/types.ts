/**
 * SHARED DATA CONTRACTS — owned by the team lead.
 * Teammates must not edit this file; request changes from the lead.
 * All learner-facing strings are Persian. IDs are stable ASCII kebab-case.
 */

export type AgeBand = "7-10" | "11-14";
export type SessionId = "s1" | "s2" | "s3" | "s4" | "enrich";

/** Text that may differ by age band. `young` falls back to `base`. */
export interface AgeText {
  base: string;
  young?: string; // ages 7–10 simpler phrasing
  older?: string; // ages 11–14 richer phrasing
}

export interface GlossaryTerm {
  id: string; // e.g. "cpu"
  term: string; // Persian term
  latin?: string; // original English term, rendered LTR
  definition: string; // simple Persian definition
  category: "hardware" | "software" | "files" | "security" | "network" | "thinking";
  topicIds: string[];
}

/** Visual shown inside a lesson step. `diagram` keys map to SVG components in src/components/diagrams. */
export interface StepVisual {
  diagram: string; // registered diagram key, e.g. "cpu-ram-storage"
  alt: string; // Persian alt text / accessible description
}

export type LessonStepKind =
  | "intro" // discover + why it matters
  | "explain" // step-by-step explanation
  | "demo" // interactive demonstration
  | "activity" // guided hands-on activity
  | "recap";

export interface LessonStep {
  id: string;
  kind: LessonStepKind;
  title: string;
  body: AgeText; // Persian paragraphs, "\n\n" separates paragraphs
  visual?: StepVisual;
  /** Optional lab embedded in this step. */
  labId?: LabId;
  /** Glossary term ids highlighted in this step. */
  termIds?: string[];
  /** Optional "بیشتر بدانیم" panel for older/curious learners. */
  more?: string;
}

export interface Topic {
  id: string; // e.g. "s1-t1-what-is-computer"
  sessionId: SessionId;
  order: number; // order within session
  title: string;
  purpose: string; // one-sentence friendly description
  objectives: string[]; // 2–4
  whyItMatters: AgeText;
  minutes: number; // estimated duration
  steps: LessonStep[];
  recap: string[]; // key points
  termIds: string[];
  /** Spec section 4 bullet ids this topic covers, e.g. "s1.1". Used by coverage doc/tests. */
  coverage: string[];
  enrichment?: boolean; // true for non-core topics
}

export type LabId =
  | "computer-assembly"
  | "windows-desktop"
  | "file-manager"
  | "file-type-sorter"
  | "shortcuts-trainer"
  | "compression-sim"
  | "security-detective"
  | "ports-matching"
  | "network-builder"
  | "command-line"
  | "algorithm-challenge";

// ---------- Assessment ----------

interface QBase {
  id: string;
  topicId: string;
  prompt: string; // Persian stem
  explanation: string; // shown after submit: why the answer is right/wrong
  hint?: string; // shown on a wrong answer
  reviewStepId?: string; // lesson step to revisit
  concept: string; // concept tag recorded for "needs review"
  application?: boolean; // tests reasoning rather than recall
}

export interface McqQuestion extends QBase {
  type: "mcq";
  options: { id: string; text: string }[];
  correctId: string;
}
export interface TrueFalseQuestion extends QBase {
  type: "truefalse";
  answer: boolean;
}
export interface MatchQuestion extends QBase {
  type: "match";
  pairs: { id: string; left: string; right: string }[]; // keyboard-accessible select-based matching
}
export interface OrderQuestion extends QBase {
  type: "order";
  items: { id: string; text: string }[]; // listed in CORRECT order; engine shuffles
}
export interface ScenarioQuestion extends QBase {
  type: "scenario";
  scenario: string;
  options: { id: string; text: string }[];
  correctId: string;
}
export type Question = McqQuestion | TrueFalseQuestion | MatchQuestion | OrderQuestion | ScenarioQuestion;

/** Learner response, shape depends on question type. */
export type Answer =
  | { type: "mcq" | "scenario"; optionId: string }
  | { type: "truefalse"; value: boolean }
  | { type: "match"; map: Record<string, string> } // pair id -> chosen right-side pair id
  | { type: "order"; ids: string[] };

export type ExamKind = "topic" | "checkpoint" | "capstone";

export interface Exam {
  id: string; // e.g. "exam-s1-t1", "checkpoint-s1", "capstone"
  kind: ExamKind;
  title: string;
  sessionId?: SessionId;
  topicId?: string;
  /** Question ids available; `draw` of them are sampled (shuffled) per attempt. */
  questionIds: string[];
  draw: number;
  passPercent: number; // default 80
}

export interface Session {
  id: SessionId;
  order: number;
  title: string; // e.g. "جلسه ۱: آشنایی با رایانه"
  tagline: string;
  icon: string; // emoji or icon key
  color: string; // token name from the design system, e.g. "sun"
  topicIds: string[]; // ordered
  checkpointExamId?: string;
  badgeId?: string;
}

export interface Achievement {
  id: string;
  title: string; // creative Persian name
  description: string;
  icon: string;
  /** Rule evaluated by src/lib/achievements.ts against ProgressState. */
  rule:
    | { kind: "topic-passed"; topicId: string }
    | { kind: "session-complete"; sessionId: SessionId }
    | { kind: "topics-passed-count"; count: number }
    | { kind: "lab-completed"; labId: LabId }
    | { kind: "xp-reached"; xp: number }
    | { kind: "course-complete" };
}

// ---------- Progress (persisted in localStorage) ----------

export interface AttemptRecord {
  at: string; // ISO date
  scorePercent: number;
  passed: boolean;
  missedConcepts: string[];
}

export interface ExamProgress {
  attempts: AttemptRecord[];
  bestPercent: number;
  passed: boolean;
}

export interface Profile {
  nickname: string;
  avatar: string; // avatar id
  ageBand: AgeBand;
  createdAt: string;
}

export interface ProgressState {
  version: 1;
  profile: Profile | null;
  xp: number;
  /** topicId -> set of completed lesson step ids */
  stepsDone: Record<string, string[]>;
  exams: Record<string, ExamProgress>;
  labsDone: Record<LabId, number> | Partial<Record<LabId, number>>; // labId -> times completed with mastery
  /** xp award keys already granted — prevents repeat-click XP farming. */
  xpAwarded: string[];
  achievements: Record<string, string>; // id -> ISO date earned
  /** concept -> times missed since last correct (drives review center) */
  weakConcepts: Record<string, number>;
  lastVisit?: string;
  streakDays?: number; // gentle, never pressuring
}

/** XP rules (centralised in src/lib/progress.ts). Each key can be granted once. */
export const XP = {
  stepFirstTime: 5,
  labFirstMastery: 25,
  topicPass: 50,
  checkpointPass: 120,
  capstonePass: 250,
} as const;

/** Unlock rule: topic N unlocks when topic N-1 of the same session exam passed (first topic of a session needs previous session checkpoint). */

/** What each content module (src/content/sessionN.ts) must export as default. */
export interface SessionContent {
  session: Session;
  topics: Topic[];
  questions: Question[];
  /** One exam per topic (id `exam-<topicId>`) plus the session checkpoint (id `checkpoint-<sessionId>`). */
  exams: Exam[];
  glossary: GlossaryTerm[];
  achievements: Achievement[];
}
