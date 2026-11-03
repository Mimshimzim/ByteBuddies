/** Unlock rules — owned by the lead. */
import type { ProgressState } from "./types";
import { isExamPassed } from "./progress";
import { SESSIONS, TOPICS, topicExamId } from "@/content";

/** Core topic N unlocks when the previous core topic's exam passed; session N unlocks when checkpoint N-1 passed. */
export function isTopicUnlocked(state: ProgressState, topicId: string): boolean {
  const t = TOPICS[topicId];
  if (!t) return false;
  if (t.enrichment) return true; // enrichment never blocks and is never blocked
  const session = SESSIONS.find((s) => s.id === t.sessionId)!;
  const idx = session.topicIds.indexOf(topicId);
  if (idx > 0) return isExamPassed(state, topicExamId(session.topicIds[idx - 1]));
  const sIdx = SESSIONS.findIndex((s) => s.id === session.id);
  if (sIdx === 0) return true;
  return isExamPassed(state, SESSIONS[sIdx - 1].checkpointExamId);
}

export function isCheckpointUnlocked(state: ProgressState, sessionIdx: number): boolean {
  return SESSIONS[sessionIdx].topicIds.every((id) => isExamPassed(state, topicExamId(id)));
}

export function isCapstoneUnlocked(state: ProgressState): boolean {
  return SESSIONS.every((s) => isExamPassed(state, s.checkpointExamId));
}

export function isCourseComplete(state: ProgressState): boolean {
  return isCapstoneUnlocked(state) && isExamPassed(state, "capstone");
}
