/** Exam engine — owned by the lead. Pure and unit-testable. */
import type { Answer, Exam, Question, AttemptRecord } from "./types";

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Draw questions for an attempt; avoids repeating the previous attempt's exact order when pool allows. */
export function drawQuestions(exam: Exam, bank: Record<string, Question>, rand: () => number = Math.random, previousIds?: string[]): Question[] {
  const pool = exam.questionIds.map((id) => bank[id]).filter(Boolean);
  const n = Math.min(exam.draw, pool.length);
  let picked = shuffle(pool, rand).slice(0, n);
  if (previousIds && n > 1 && picked.map((q) => q.id).join() === previousIds.join()) picked = [...picked.slice(1), picked[0]];
  return picked;
}

export function isCorrect(q: Question, a: Answer): boolean {
  if (q.type !== a.type && !((q.type === "scenario" || q.type === "mcq") && (a.type === "mcq" || a.type === "scenario"))) return false;
  switch (q.type) {
    case "mcq":
    case "scenario":
      return (a as { optionId: string }).optionId === q.correctId;
    case "truefalse":
      return (a as { value: boolean }).value === q.answer;
    case "match": {
      const map = (a as { map: Record<string, string> }).map;
      return q.pairs.every((p) => map[p.id] === p.id);
    }
    case "order": {
      const ids = (a as { ids: string[] }).ids;
      return ids.length === q.items.length && q.items.every((it, i) => ids[i] === it.id);
    }
  }
}

export function scoreExam(exam: Exam, questions: Question[], answers: Record<string, Answer>) {
  const results = questions.map((q) => ({ q, correct: !!answers[q.id] && isCorrect(q, answers[q.id]) }));
  const correctCount = results.filter((r) => r.correct).length;
  const scorePercent = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const attempt: AttemptRecord = {
    at: new Date().toISOString(),
    scorePercent,
    passed: questions.length > 0 && (correctCount / questions.length) * 100 >= exam.passPercent,
    missedConcepts: [...new Set(results.filter((r) => !r.correct).map((r) => r.q.concept))],
  };
  return { results, correctCount, scorePercent, attempt };
}
