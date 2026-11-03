import { describe, it, expect, vi } from "vitest";

vi.mock("@/content", () => {
  const SESSIONS = [
    { id: "s1", topicIds: ["t1", "t2"], checkpointExamId: "checkpoint-s1" },
    { id: "s2", topicIds: ["t3"], checkpointExamId: "checkpoint-s2" },
  ];
  const TOPICS: Record<string, unknown> = {
    t1: { id: "t1", sessionId: "s1" },
    t2: { id: "t2", sessionId: "s1" },
    t3: { id: "t3", sessionId: "s2" },
    bonus: { id: "bonus", sessionId: "enrich", enrichment: true },
  };
  return { SESSIONS, TOPICS, topicExamId: (id: string) => `exam-${id}` };
});

import { isCapstoneUnlocked, isCheckpointUnlocked, isCourseComplete, isTopicUnlocked } from "@/lib/unlock";
import { emptyProgress } from "@/lib/progress";
import type { ProgressState } from "@/lib/types";

const passed = (...ids: string[]): ProgressState => {
  const s = emptyProgress();
  for (const id of ids) s.exams[id] = { attempts: [], bestPercent: 100, passed: true };
  return s;
};

describe("unlock rules", () => {
  it("first topic of first session is open; second needs first's exam", () => {
    expect(isTopicUnlocked(emptyProgress(), "t1")).toBe(true);
    expect(isTopicUnlocked(emptyProgress(), "t2")).toBe(false);
    expect(isTopicUnlocked(passed("exam-t1"), "t2")).toBe(true);
  });
  it("failed (unpassed) attempt does not unlock", () => {
    const s = emptyProgress();
    s.exams["exam-t1"] = { attempts: [], bestPercent: 70, passed: false };
    expect(isTopicUnlocked(s, "t2")).toBe(false);
  });
  it("next session needs previous checkpoint, not just topic exams", () => {
    expect(isTopicUnlocked(passed("exam-t1", "exam-t2"), "t3")).toBe(false);
    expect(isTopicUnlocked(passed("checkpoint-s1"), "t3")).toBe(true);
  });
  it("enrichment is always unlocked; unknown topics are locked", () => {
    expect(isTopicUnlocked(emptyProgress(), "bonus")).toBe(true);
    expect(isTopicUnlocked(emptyProgress(), "ghost")).toBe(false);
  });
  it("checkpoint needs all topic exams of the session", () => {
    expect(isCheckpointUnlocked(passed("exam-t1"), 0)).toBe(false);
    expect(isCheckpointUnlocked(passed("exam-t1", "exam-t2"), 0)).toBe(true);
  });
  it("capstone needs all checkpoints; course complete needs capstone passed", () => {
    expect(isCapstoneUnlocked(passed("checkpoint-s1"))).toBe(false);
    const ready = passed("checkpoint-s1", "checkpoint-s2");
    expect(isCapstoneUnlocked(ready)).toBe(true);
    expect(isCourseComplete(ready)).toBe(false);
    expect(isCourseComplete(passed("checkpoint-s1", "checkpoint-s2", "capstone"))).toBe(true);
    expect(isCourseComplete(passed("capstone"))).toBe(false);
  });
});
