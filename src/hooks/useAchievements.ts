"use client";
import { useMemo } from "react";
import { ACHIEVEMENTS, SESSIONS, TOPICS, topicExamId } from "@/content";
import { isExamPassed } from "@/lib/progress";
import { isCourseComplete } from "@/lib/unlock";
import type { Achievement, ProgressState } from "@/lib/types";
import { useProgress } from "@/components/ProgressProvider";

export function ruleSatisfied(state: ProgressState, rule: Achievement["rule"]): boolean {
  switch (rule.kind) {
    case "topic-passed":
      return isExamPassed(state, topicExamId(rule.topicId));
    case "session-complete": {
      const s = SESSIONS.find((x) => x.id === rule.sessionId);
      return !!s && isExamPassed(state, s.checkpointExamId);
    }
    case "topics-passed-count":
      return Object.keys(TOPICS).filter((id) => isExamPassed(state, topicExamId(id))).length >= rule.count;
    case "lab-completed":
      return (state.labsDone[rule.labId] ?? 0) > 0;
    case "xp-reached":
      return state.xp >= rule.xp;
    case "course-complete":
      return isCourseComplete(state);
  }
}

/** Ids of achievements whose rule is satisfied but not yet recorded. */
export function newlyEarned(state: ProgressState): string[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && ruleSatisfied(state, a.rule)).map((a) => a.id);
}

/** Returns a state with newly earned achievements recorded (pure). */
export function applyAchievements(state: ProgressState): ProgressState {
  const ids = newlyEarned(state);
  if (!ids.length) return state;
  const at = new Date().toISOString();
  return { ...state, achievements: { ...state.achievements, ...Object.fromEntries(ids.map((id) => [id, at])) } };
}

export function useAchievements() {
  const { progress } = useProgress();
  return useMemo(
    () => ACHIEVEMENTS.map((a) => ({ ...a, earnedAt: progress.achievements[a.id] as string | undefined })),
    [progress.achievements],
  );
}
