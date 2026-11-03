import { describe, it, expect, afterEach, vi } from "vitest";
import { awardXp, completeStep, completeLab, emptyProgress, isExamPassed, loadProgress, recordAttempt, sanitize, saveProgress, STORAGE_KEY } from "@/lib/progress";
import { XP, type AttemptRecord } from "@/lib/types";

const att = (scorePercent: number, passed: boolean, missed: string[] = []): AttemptRecord => ({ at: "2026-01-01T00:00:00Z", scorePercent, passed, missedConcepts: missed });

describe("sanitize", () => {
  it("returns empty state for garbage", () => {
    for (const g of [null, undefined, 5, "x", [], { version: 2 }, {}]) expect(sanitize(g)).toEqual(emptyProgress());
  });
  it("repairs bad fields but keeps valid ones", () => {
    const s = sanitize({ version: 1, xp: -5, stepsDone: [], exams: "x", xpAwarded: ["a", 3, null], weakConcepts: 1, profile: { nickname: "n", avatar: "a", ageBand: "99" } });
    expect(s.xp).toBe(0);
    expect(s.stepsDone).toEqual({});
    expect(s.exams).toEqual({});
    expect(s.xpAwarded).toEqual(["a"]);
    expect(s.profile).toBeNull();
  });
  it("keeps valid profile, truncates nickname, floors xp", () => {
    const s = sanitize({ version: 1, xp: 12.9, profile: { nickname: "x".repeat(50), avatar: "fox", ageBand: "7-10" } });
    expect(s.xp).toBe(12);
    expect(s.profile?.nickname).toHaveLength(20);
  });
  it("rejects NaN/Infinity xp", () => {
    expect(sanitize({ version: 1, xp: Infinity }).xp).toBe(0);
    expect(sanitize({ version: 1, xp: "5" }).xp).toBe(0);
  });
});

describe("storage", () => {
  afterEach(() => vi.unstubAllGlobals());
  const fake = (init: Record<string, string> = {}, throwOnSet = false) => {
    const m = new Map(Object.entries(init));
    vi.stubGlobal("window", { localStorage: { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => { if (throwOnSet) throw new Error("full"); m.set(k, v); } } });
    return m;
  };
  it("loads empty without window (SSR)", () => expect(loadProgress()).toEqual(emptyProgress()));
  it("recovers from corrupt JSON", () => {
    fake({ [STORAGE_KEY]: "{not json" });
    expect(loadProgress()).toEqual(emptyProgress());
  });
  it("round-trips", () => {
    fake();
    const s = awardXp(emptyProgress(), "k", 7);
    expect(saveProgress(s)).toBe(true);
    expect(loadProgress().xp).toBe(7);
  });
  it("saveProgress returns false when storage throws or is missing", () => {
    fake({}, true);
    expect(saveProgress(emptyProgress())).toBe(false);
    vi.unstubAllGlobals();
    expect(saveProgress(emptyProgress())).toBe(false);
  });
});

describe("XP rules", () => {
  it("awardXp is idempotent and does not mutate", () => {
    const s0 = emptyProgress();
    const s1 = awardXp(s0, "k", 10);
    expect(s0.xp).toBe(0);
    expect(awardXp(s1, "k", 10)).toBe(s1);
    expect(awardXp(s1, "k2", 5).xp).toBe(15);
  });
  it("completeStep grants XP once", () => {
    let s = completeStep(emptyProgress(), "t", "a");
    s = completeStep(s, "t", "a");
    expect(s.xp).toBe(XP.stepFirstTime);
    expect(s.stepsDone.t).toEqual(["a"]);
    s = completeStep(s, "t", "b");
    expect(s.xp).toBe(2 * XP.stepFirstTime);
  });
  it("completeLab counts completions but XP once", () => {
    let s = completeLab(emptyProgress(), "command-line");
    s = completeLab(s, "command-line");
    expect(s.labsDone["command-line"]).toBe(2);
    expect(s.xp).toBe(XP.labFirstMastery);
  });
});

describe("recordAttempt", () => {
  const concepts = (c: [string, boolean][]) => c.map(([concept, correct]) => ({ concept, correct }));
  it("fail then pass: best score, passed sticks, XP once", () => {
    let s = recordAttempt(emptyProgress(), "e1", "topic", att(40, false, ["a"]), concepts([["a", false], ["b", true]]));
    expect(s.xp).toBe(0);
    expect(s.exams.e1.bestPercent).toBe(40);
    expect(s.weakConcepts).toEqual({ a: 1 });
    s = recordAttempt(s, "e1", "topic", att(100, true), concepts([["a", true]]));
    expect(s.xp).toBe(XP.topicPass);
    expect(s.weakConcepts).toEqual({});
    s = recordAttempt(s, "e1", "topic", att(20, false, ["a"]), concepts([["a", false]]));
    expect(s.exams.e1.passed).toBe(true);
    expect(s.exams.e1.bestPercent).toBe(100);
    s = recordAttempt(s, "e1", "topic", att(100, true), concepts([]));
    expect(s.xp).toBe(XP.topicPass);
    expect(s.exams.e1.attempts).toHaveLength(4);
    expect(isExamPassed(s, "e1")).toBe(true);
  });
  it("XP amounts by kind", () => {
    expect(recordAttempt(emptyProgress(), "c", "checkpoint", att(90, true), []).xp).toBe(XP.checkpointPass);
    expect(recordAttempt(emptyProgress(), "cap", "capstone", att(90, true), []).xp).toBe(XP.capstonePass);
  });
  it("weak concept counter increments on repeated misses", () => {
    let s = recordAttempt(emptyProgress(), "e", "topic", att(0, false), concepts([["x", false]]));
    s = recordAttempt(s, "e", "topic", att(0, false), concepts([["x", false]]));
    expect(s.weakConcepts.x).toBe(2);
  });
  it("keeps only last 20 attempts", () => {
    let s = emptyProgress();
    for (let i = 0; i < 25; i++) s = recordAttempt(s, "e", "topic", att(i, false), []);
    expect(s.exams.e.attempts).toHaveLength(20);
  });
  it("isExamPassed handles undefined/unknown", () => {
    expect(isExamPassed(emptyProgress(), undefined)).toBe(false);
    expect(isExamPassed(emptyProgress(), "nope")).toBe(false);
  });
});
