import { describe, expect, it } from "vitest";
import s1 from "../src/content/session1";
import { assemblyReducer, initialAssemblyState, isComplete, SLOTS, type PartId, type SlotId } from "../src/components/labs/assemblyState";
import { desktopReducer, initialDesktopState, MISSIONS } from "../src/components/labs/desktopState";

describe("Session 1 content integrity", () => {
  const qIds = s1.questions.map((q) => q.id);
  const qSet = new Set(qIds);

  it("has unique ids", () => {
    expect(new Set(qIds).size).toBe(qIds.length);
    expect(new Set(s1.topics.map((t) => t.id)).size).toBe(s1.topics.length);
    expect(new Set(s1.exams.map((e) => e.id)).size).toBe(s1.exams.length);
    expect(new Set(s1.glossary.map((g) => g.id)).size).toBe(s1.glossary.length);
    expect(new Set(s1.achievements.map((a) => a.id)).size).toBe(s1.achievements.length);
    const stepIds = s1.topics.flatMap((t) => t.steps.map((s) => s.id));
    expect(new Set(stepIds).size).toBe(stepIds.length);
  });

  it("every exam question exists and draw fits pool", () => {
    for (const e of s1.exams) {
      for (const id of e.questionIds) expect(qSet.has(id), `${e.id} -> ${id}`).toBe(true);
      expect(e.draw).toBeLessThanOrEqual(e.questionIds.length);
      expect(e.passPercent).toBe(80);
    }
    for (const t of s1.topics) {
      const ex = s1.exams.find((e) => e.id === `exam-${t.id}`)!;
      expect(ex, t.id).toBeTruthy();
      expect(ex.questionIds.length).toBeGreaterThanOrEqual(8);
      expect(ex.questionIds.length).toBeLessThanOrEqual(10);
      const apps = ex.questionIds.filter((id) => s1.questions.find((q) => q.id === id)!.application);
      expect(apps.length, `${t.id} application questions`).toBeGreaterThanOrEqual(2);
    }
    const cp = s1.exams.find((e) => e.id === "checkpoint-s1")!;
    expect(cp.questionIds.length).toBeGreaterThanOrEqual(24);
    expect(cp.draw).toBe(12);
    expect(cp.questionIds.some((id) => s1.questions.find((q) => q.id === id)!.type === "scenario")).toBe(true);
  });

  it("questions are well formed", () => {
    const stepIds = new Set(s1.topics.flatMap((t) => t.steps.map((s) => s.id)));
    for (const q of s1.questions) {
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.hint, q.id).toBeTruthy();
      expect(stepIds.has(q.reviewStepId!), `${q.id} reviewStepId`).toBe(true);
      expect(s1.topics.some((t) => t.id === q.topicId)).toBe(true);
      if (q.type === "order") expect(q.items.length).toBeGreaterThanOrEqual(3);
      if (q.type === "match") {
        expect(q.pairs.length).toBeGreaterThanOrEqual(3);
        expect(new Set(q.pairs.map((p) => p.right)).size).toBe(q.pairs.length);
      }
      if (q.type === "mcq" || q.type === "scenario") {
        expect(q.options.some((o) => o.id === q.correctId)).toBe(true);
        expect(new Set(q.options.map((o) => o.text)).size).toBe(q.options.length);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
      }
    }
    const types = new Set(s1.questions.map((q) => q.type));
    for (const t of ["mcq", "truefalse", "match", "order", "scenario"]) expect(types.has(t as never)).toBe(true);
  });

  it("covers s1.1-s1.7 and lessons follow the structure", () => {
    const cov = new Set(s1.topics.flatMap((t) => t.coverage));
    for (let i = 1; i <= 7; i++) expect(cov.has(`s1.${i}`)).toBe(true);
    for (const t of s1.topics) {
      expect(t.steps.length).toBeGreaterThanOrEqual(5);
      expect(t.steps.length).toBeLessThanOrEqual(8);
      expect(t.objectives.length).toBeGreaterThanOrEqual(2);
      expect(t.objectives.length).toBeLessThanOrEqual(4);
      const kinds = t.steps.map((s) => s.kind);
      for (const k of ["intro", "explain", "demo", "activity", "recap"]) expect(kinds).toContain(k);
      expect(t.steps.some((s) => s.visual)).toBe(true);
    }
    expect(s1.session.topicIds).toEqual(s1.topics.map((t) => t.id));
  });

  it("glossary term ids resolve and glossary is large enough", () => {
    expect(s1.glossary.length).toBeGreaterThanOrEqual(30);
    const gl = new Set(s1.glossary.map((g) => g.id));
    for (const t of s1.topics) {
      for (const id of t.termIds) expect(gl.has(id), `${t.id} termId ${id}`).toBe(true);
      for (const s of t.steps) for (const id of s.termIds ?? []) expect(gl.has(id), `${s.id} ${id}`).toBe(true);
    }
    for (const g of s1.glossary) for (const tid of g.topicIds) expect(s1.topics.some((t) => t.id === tid)).toBe(true);
  });

  it("achievements reference real topics and the session badge", () => {
    const ids = new Set(s1.topics.map((t) => t.id));
    for (const a of s1.achievements) if (a.rule.kind === "topic-passed") expect(ids.has(a.rule.topicId)).toBe(true);
    expect(s1.achievements.some((a) => a.id === s1.session.badgeId && a.rule.kind === "session-complete")).toBe(true);
  });

  it("contains no placeholder text", () => {
    const blob = JSON.stringify(s1);
    expect(blob).not.toMatch(/lorem|TODO|placeholder|گزینه ?[ABCD]\b|سؤال ?\d/i);
  });
});

describe("computer-assembly state", () => {
  const place = (s: ReturnType<typeof initialAssemblyState>, slot: SlotId, part: PartId) => assemblyReducer(s, { type: "place", slot, part });

  it("rejects wrong slot with explanation, requires motherboard first, completes on valid path", () => {
    let s = initialAssemblyState();
    s = place(s, "cpu-socket", "cpu");
    expect(s.feedback.kind).toBe("error");
    expect(s.placed["cpu-socket"]).toBeNull();
    s = place(s, "ram-slot", "cpu");
    expect(s.feedback.kind).toBe("error");
    s = place(s, "case", "motherboard");
    s = place(s, "cpu-socket", "cpu");
    s = place(s, "ram-slot", "ram");
    s = place(s, "storage-bay", "hdd");
    s = place(s, "psu-bay", "psu");
    s = place(s, "monitor-port", "monitor");
    s = place(s, "keyboard-port", "keyboard");
    expect(s.completed).toBe(false);
    s = place(s, "mouse-port", "mouse");
    expect(s.completed).toBe(true);
    expect(isComplete(s)).toBe(true);
    expect(assemblyReducer(s, { type: "reset" })).toEqual(initialAssemblyState());
  });

  it("supports select-then-place keyboard path", () => {
    let s = assemblyReducer(initialAssemblyState(), { type: "select", part: "motherboard" });
    s = assemblyReducer(s, { type: "place", slot: "case" });
    expect(s.placed.case).toBe("motherboard");
    expect(SLOTS.length).toBe(8);
  });
});

describe("windows-desktop state", () => {
  it("completes only after all missions and does not break on repeats", () => {
    let s = initialDesktopState();
    const d = (a: Parameters<typeof desktopReducer>[1]) => (s = desktopReducer(s, a));
    d({ type: "switch-next" });
    expect(s.done.switch).toBe(false);
    d({ type: "toggle-start" });
    d({ type: "open", app: "settings" });
    d({ type: "open", app: "mail" });
    d({ type: "switch-next" });
    expect(s.done.switch).toBe(true);
    d({ type: "set-wallpaper", wallpaper: "forest" });
    d({ type: "minimize", app: "mail" });
    d({ type: "taskbar", app: "mail" });
    d({ type: "mail-send" });
    expect(s.done.mail).toBe(false);
    d({ type: "mail-edit", field: "to", value: "teacher.demo@example.com" });
    d({ type: "mail-edit", field: "subject", value: "پرسش" });
    d({ type: "mail-edit", field: "body", value: "سلام، یک سؤال دارم." });
    d({ type: "mail-send" });
    expect(s.done.mail).toBe(true);
    expect(s.completed).toBe(false);
    d({ type: "close", app: "settings" });
    expect(s.completed).toBe(true);
    expect(MISSIONS.every((m) => s.done[m.id])).toBe(true);
  });
});
