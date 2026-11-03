import { EXAMS, SESSIONS, TOPICS, topicExamId } from "@/content";
import type { ProgressState, Session, Topic } from "@/lib/types";
import { isExamPassed } from "@/lib/progress";
import { isTopicUnlocked } from "@/lib/unlock";

export type NodeState = "locked" | "open" | "done";

export const STATE_LABEL: Record<NodeState, string> = { locked: "قفل", open: "آماده", done: "انجام شد" };

export function topicState(p: ProgressState, topicId: string): NodeState {
  if (isExamPassed(p, topicExamId(topicId))) return "done";
  return isTopicUnlocked(p, topicId) ? "open" : "locked";
}

/** Core topics of a session in order (session.topicIds), then optional enrichment topics. */
export function sessionTopics(s: Session): { core: Topic[]; enrichment: Topic[] } {
  const core = s.topicIds.map((id) => TOPICS[id]).filter(Boolean);
  const enrichment = Object.values(TOPICS)
    .filter((t) => t.sessionId === s.id && t.enrichment && !s.topicIds.includes(t.id))
    .sort((a, b) => a.order - b.order);
  return { core, enrichment };
}

export function sessionProgress(p: ProgressState, s: Session) {
  const { core } = sessionTopics(s);
  const done = core.filter((t) => isExamPassed(p, topicExamId(t.id))).length;
  return { done, total: core.length, percent: core.length ? (done / core.length) * 100 : 0 };
}

export function overallProgress(p: ProgressState) {
  let done = 0;
  let total = 0;
  for (const s of SESSIONS) {
    const sp = sessionProgress(p, s);
    done += sp.done;
    total += sp.total;
  }
  return { done, total, percent: total ? (done / total) * 100 : 0 };
}

/** First core topic not yet passed (and unlocked), for the "continue" button. */
export function nextTopicToLearn(p: ProgressState): Topic | undefined {
  for (const s of SESSIONS) {
    for (const t of sessionTopics(s).core) {
      if (!isExamPassed(p, topicExamId(t.id)) && isTopicUnlocked(p, t.id)) return t;
    }
  }
  return undefined;
}

/** What comes after a topic: next core topic, or the session checkpoint. */
export function afterTopic(topicId: string): { href: string; label: string } | null {
  const t = TOPICS[topicId];
  if (!t) return null;
  const s = SESSIONS.find((x) => x.id === t.sessionId);
  if (!s) return null;
  const idx = s.topicIds.indexOf(topicId);
  if (idx >= 0 && idx < s.topicIds.length - 1) {
    const n = TOPICS[s.topicIds[idx + 1]];
    if (n) return { href: `/topic/${n.id}`, label: `درس بعدی: ${n.title}` };
  }
  if (idx >= 0 && s.checkpointExamId && EXAMS[s.checkpointExamId]) return { href: `/exam/${s.checkpointExamId}`, label: "آزمون پایان جلسه" };
  return { href: "/map", label: "بازگشت به نقشه" };
}

export const PENDING_SESSIONS = [
  { order: 2, title: "جلسه ۲: فایل‌ها و ذخیره‌سازی", icon: "🗂️" },
  { order: 3, title: "جلسه ۳: امنیت و مدیریت ویندوز", icon: "🛡️" },
  { order: 4, title: "جلسه ۴: مبانی شبکه و اینترنت", icon: "🌐" },
];
