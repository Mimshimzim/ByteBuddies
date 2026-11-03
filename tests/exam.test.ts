import { describe, it, expect } from "vitest";
import { drawQuestions, isCorrect, scoreExam, shuffle } from "@/lib/exam";
import type { Answer, Exam, Question } from "@/lib/types";

const base = { topicId: "t", prompt: "p", explanation: "e", concept: "c" };
const mcq: Question = { ...base, id: "q1", type: "mcq", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }], correctId: "b", concept: "c1" };
const scen: Question = { ...base, id: "q2", type: "scenario", scenario: "s", options: [{ id: "a", text: "A" }, { id: "b", text: "B" }], correctId: "a", concept: "c2" };
const tf: Question = { ...base, id: "q3", type: "truefalse", answer: false, concept: "c3" };
const match: Question = { ...base, id: "q4", type: "match", pairs: [{ id: "p1", left: "l1", right: "r1" }, { id: "p2", left: "l2", right: "r2" }], concept: "c4" };
const order: Question = { ...base, id: "q5", type: "order", items: [{ id: "i1", text: "1" }, { id: "i2", text: "2" }, { id: "i3", text: "3" }], concept: "c5" };
const bank: Record<string, Question> = Object.fromEntries([mcq, scen, tf, match, order].map((q) => [q.id, q]));
const exam = (over: Partial<Exam> = {}): Exam => ({ id: "e", kind: "topic", title: "t", questionIds: ["q1", "q2", "q3", "q4", "q5"], draw: 5, passPercent: 80, ...over });

describe("isCorrect", () => {
  it("mcq / scenario", () => {
    expect(isCorrect(mcq, { type: "mcq", optionId: "b" })).toBe(true);
    expect(isCorrect(mcq, { type: "mcq", optionId: "a" })).toBe(false);
    expect(isCorrect(scen, { type: "scenario", optionId: "a" })).toBe(true);
    expect(isCorrect(scen, { type: "mcq", optionId: "a" })).toBe(true);
  });
  it("truefalse", () => {
    expect(isCorrect(tf, { type: "truefalse", value: false })).toBe(true);
    expect(isCorrect(tf, { type: "truefalse", value: true })).toBe(false);
  });
  it("match requires every pair", () => {
    expect(isCorrect(match, { type: "match", map: { p1: "p1", p2: "p2" } })).toBe(true);
    expect(isCorrect(match, { type: "match", map: { p1: "p2", p2: "p1" } })).toBe(false);
    expect(isCorrect(match, { type: "match", map: { p1: "p1" } })).toBe(false);
  });
  it("order requires exact sequence and length", () => {
    expect(isCorrect(order, { type: "order", ids: ["i1", "i2", "i3"] })).toBe(true);
    expect(isCorrect(order, { type: "order", ids: ["i2", "i1", "i3"] })).toBe(false);
    expect(isCorrect(order, { type: "order", ids: ["i1", "i2"] })).toBe(false);
  });
  it("mismatched answer type is wrong", () => {
    expect(isCorrect(tf, { type: "mcq", optionId: "a" })).toBe(false);
    expect(isCorrect(mcq, { type: "truefalse", value: true })).toBe(false);
  });
});

describe("scoreExam", () => {
  const qs = [mcq, scen, tf, match, order];
  const right: Record<string, Answer> = { q1: { type: "mcq", optionId: "b" }, q2: { type: "scenario", optionId: "a" }, q3: { type: "truefalse", value: false }, q4: { type: "match", map: { p1: "p1", p2: "p2" } }, q5: { type: "order", ids: ["i1", "i2", "i3"] } };
  it("100% passes", () => {
    const r = scoreExam(exam(), qs, { ...right });
    expect(r.scorePercent).toBe(100);
    expect(r.attempt.passed).toBe(true);
    expect(r.attempt.missedConcepts).toEqual([]);
  });
  it("80% (4/5) passes exactly at threshold", () => {
    const r = scoreExam(exam(), qs, { ...right, q3: { type: "truefalse", value: true } });
    expect(r.scorePercent).toBe(80);
    expect(r.attempt.passed).toBe(true);
    expect(r.attempt.missedConcepts).toEqual(["c3"]);
  });
  it("60% (3/5) fails", () => {
    const r = scoreExam(exam(), qs, { ...right, q3: { type: "truefalse", value: true }, q1: { type: "mcq", optionId: "a" } });
    expect(r.scorePercent).toBe(60);
    expect(r.attempt.passed).toBe(false);
  });
  it("unanswered counts wrong; empty set is 0 and fails", () => {
    expect(scoreExam(exam(), qs, {}).scorePercent).toBe(0);
    const r = scoreExam(exam(), [], {});
    expect(r.scorePercent).toBe(0);
    expect(r.attempt.passed).toBe(false);
  });
  it("respects custom pass threshold", () => {
    expect(scoreExam(exam({ passPercent: 60 }), qs, { ...right, q3: { type: "truefalse", value: true }, q1: { type: "mcq", optionId: "a" } }).attempt.passed).toBe(true);
  });
  // NOTE: pass check uses the rounded percent; 79.6 rounds to 80 and passes (e.g. 199/250 correct is not reachable with small exams but is with large ones).
  it("rounded percent is compared to threshold (documented behaviour)", () => {
    const many: Question[] = Array.from({ length: 25 }, (_, i) => ({ ...tf, id: `m${i}` }));
    const answers = Object.fromEntries(many.map((q, i) => [q.id, { type: "truefalse" as const, value: i >= 5 ? false : true }]));
    expect(scoreExam(exam(), many, answers).scorePercent).toBe(80);
  });
});

describe("drawQuestions / shuffle", () => {
  it("shuffle keeps elements and does not mutate input", () => {
    const src = [1, 2, 3, 4, 5, 6];
    const out = shuffle(src);
    expect([...out].sort()).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it("draws min(draw, pool) unique questions", () => {
    const d = drawQuestions(exam({ draw: 3 }), bank);
    expect(d).toHaveLength(3);
    expect(new Set(d.map((q) => q.id)).size).toBe(3);
    expect(drawQuestions(exam({ draw: 99 }), bank)).toHaveLength(5);
  });
  it("ignores unknown ids", () => {
    expect(drawQuestions(exam({ questionIds: ["q1", "nope"], draw: 5 }), bank)).toHaveLength(1);
  });
  it("never repeats the previous order identically", () => {
    const ids = ["q1", "q2", "q3", "q4", "q5"];
    for (let i = 0; i < 200; i++) {
      const d = drawQuestions(exam(), bank, Math.random, ids);
      expect(d.map((q) => q.id).join()).not.toBe(ids.join());
    }
    // deterministic rand=0.999 keeps order? force collision
    const noShuffle = () => 0.9999999;
    const first = drawQuestions(exam(), bank, noShuffle);
    const second = drawQuestions(exam(), bank, noShuffle, first.map((q) => q.id));
    expect(second.map((q) => q.id)).not.toEqual(first.map((q) => q.id));
  });
});
