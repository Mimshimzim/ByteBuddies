import type { McqQuestion, MatchQuestion, OrderQuestion, ScenarioQuestion, TrueFalseQuestion } from "@/lib/types";

const IDS = ["a", "b", "c", "d", "e"];

/** Places the correct option at a position that rotates with `pos` so answers never follow a pattern. */
function build(correct: string, wrongs: string[], pos: number) {
  const slots = wrongs.length + 1;
  const at = ((pos % slots) + slots) % slots;
  const texts = [...wrongs];
  texts.splice(at, 0, correct);
  return { options: texts.map((text, i) => ({ id: IDS[i], text })), correctId: IDS[at] };
}

interface Common {
  id: string;
  topicId: string;
  concept: string;
  step: string;
  explanation: string;
  hint: string;
  app?: boolean;
}

export function mcq(c: Common, prompt: string, correct: string, wrongs: string[], pos: number): McqQuestion {
  return { type: "mcq", id: c.id, topicId: c.topicId, prompt, ...build(correct, wrongs, pos), explanation: c.explanation, hint: c.hint, reviewStepId: c.step, concept: c.concept, application: c.app };
}

export function scenario(c: Common, scenarioText: string, prompt: string, correct: string, wrongs: string[], pos: number): ScenarioQuestion {
  return { type: "scenario", id: c.id, topicId: c.topicId, scenario: scenarioText, prompt, ...build(correct, wrongs, pos), explanation: c.explanation, hint: c.hint, reviewStepId: c.step, concept: c.concept, application: c.app ?? true };
}

export function tf(c: Common, prompt: string, answer: boolean): TrueFalseQuestion {
  return { type: "truefalse", id: c.id, topicId: c.topicId, prompt, answer, explanation: c.explanation, hint: c.hint, reviewStepId: c.step, concept: c.concept, application: c.app };
}

export function match(c: Common, prompt: string, pairs: [string, string][]): MatchQuestion {
  return { type: "match", id: c.id, topicId: c.topicId, prompt, pairs: pairs.map(([left, right], i) => ({ id: `p${i + 1}`, left, right })), explanation: c.explanation, hint: c.hint, reviewStepId: c.step, concept: c.concept, application: c.app };
}

export function order(c: Common, prompt: string, items: string[]): OrderQuestion {
  return { type: "order", id: c.id, topicId: c.topicId, prompt, items: items.map((text, i) => ({ id: `o${i + 1}`, text })), explanation: c.explanation, hint: c.hint, reviewStepId: c.step, concept: c.concept, application: c.app };
}
