/** Central progress model — owned by the lead. Pure functions + safe storage. */
import type { ProgressState, Profile, ExamProgress, AttemptRecord, LabId } from "./types";
import { XP } from "./types";

export const STORAGE_KEY = "bytebuddies.progress.v1";

export function emptyProgress(): ProgressState {
  return { version: 1, profile: null, xp: 0, stepsDone: {}, exams: {}, labsDone: {}, xpAwarded: [], achievements: {}, weakConcepts: {} };
}

/** Validate/repair arbitrary parsed JSON; never throws. */
export function sanitize(raw: unknown): ProgressState {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Record<string, any>;
  if (r.version !== 1) return base;
  const isObj = (v: unknown) => !!v && typeof v === "object" && !Array.isArray(v);
  const p = r.profile;
  const profile: Profile | null =
    isObj(p) && typeof p.nickname === "string" && typeof p.avatar === "string" && (p.ageBand === "7-10" || p.ageBand === "11-14")
      ? { nickname: p.nickname.slice(0, 20), avatar: p.avatar, ageBand: p.ageBand, createdAt: String(p.createdAt ?? "") }
      : null;
  return {
    ...base,
    profile,
    xp: Number.isFinite(r.xp) && r.xp >= 0 ? Math.floor(r.xp) : 0,
    stepsDone: isObj(r.stepsDone) ? r.stepsDone : {},
    exams: isObj(r.exams) ? r.exams : {},
    labsDone: isObj(r.labsDone) ? r.labsDone : {},
    xpAwarded: Array.isArray(r.xpAwarded) ? r.xpAwarded.filter((x: unknown) => typeof x === "string") : [],
    achievements: isObj(r.achievements) ? r.achievements : {},
    weakConcepts: isObj(r.weakConcepts) ? r.weakConcepts : {},
    ...(typeof r.lastVisit === "string" ? { lastVisit: r.lastVisit } : {}),
    ...(Number.isFinite(r.streakDays) ? { streakDays: r.streakDays } : {}),
  };
}

export function loadProgress(): ProgressState {
  try {
    const s = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    return s ? sanitize(JSON.parse(s)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

/** Returns false if storage is unavailable so the UI can show a Persian notice. */
export function saveProgress(state: ProgressState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Grants XP once per key (anti-farming). Pure: returns new state. */
export function awardXp(state: ProgressState, key: string, amount: number): ProgressState {
  if (state.xpAwarded.includes(key)) return state;
  return { ...state, xp: state.xp + amount, xpAwarded: [...state.xpAwarded, key] };
}

export function completeStep(state: ProgressState, topicId: string, stepId: string): ProgressState {
  const done = state.stepsDone[topicId] ?? [];
  if (done.includes(stepId)) return state;
  const next = { ...state, stepsDone: { ...state.stepsDone, [topicId]: [...done, stepId] } };
  return awardXp(next, `step:${topicId}:${stepId}`, XP.stepFirstTime);
}

export function completeLab(state: ProgressState, labId: LabId): ProgressState {
  const n = (state.labsDone[labId] ?? 0) + 1;
  const next = { ...state, labsDone: { ...state.labsDone, [labId]: n } };
  return awardXp(next, `lab:${labId}`, XP.labFirstMastery);
}

/** Record an exam attempt; updates best score, pass state, weak concepts and XP (once per exam). */
export function recordAttempt(
  state: ProgressState,
  examId: string,
  kind: "topic" | "checkpoint" | "capstone",
  attempt: AttemptRecord,
  answeredConcepts: { concept: string; correct: boolean }[],
): ProgressState {
  const prev: ExamProgress = state.exams[examId] ?? { attempts: [], bestPercent: 0, passed: false };
  const ep: ExamProgress = {
    attempts: [...prev.attempts, attempt].slice(-20),
    bestPercent: Math.max(prev.bestPercent, attempt.scorePercent),
    passed: prev.passed || attempt.passed,
  };
  const weak = { ...state.weakConcepts };
  for (const { concept, correct } of answeredConcepts) {
    if (correct) delete weak[concept];
    else weak[concept] = (weak[concept] ?? 0) + 1;
  }
  let next: ProgressState = { ...state, exams: { ...state.exams, [examId]: ep }, weakConcepts: weak };
  if (attempt.passed) {
    const amt = kind === "topic" ? XP.topicPass : kind === "checkpoint" ? XP.checkpointPass : XP.capstonePass;
    next = awardXp(next, `exam:${examId}`, amt);
  }
  return next;
}

export function isExamPassed(state: ProgressState, examId: string | undefined): boolean {
  return !!examId && !!state.exams[examId]?.passed;
}
