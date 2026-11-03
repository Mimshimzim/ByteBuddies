"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXAMS, QUESTIONS, SESSIONS, TOPICS } from "@/content";
import { drawQuestions, isCorrect, scoreExam, shuffle } from "@/lib/exam";
import { isCapstoneUnlocked, isCheckpointUnlocked, isTopicUnlocked } from "@/lib/unlock";
import type { Answer, Exam, Question } from "@/lib/types";
import { Mascot } from "./Mascot";
import { useProgress } from "./ProgressProvider";
import { afterTopic } from "./curriculum";
import { Loading, Notice, ProgressBar, fa } from "./ui";

interface Attempt {
  questions: Question[];
  /** stable per-attempt display order of option/right/item ids, keyed by question id */
  orders: Record<string, string[]>;
}

function buildAttempt(exam: Exam, previousIds?: string[]): Attempt {
  const questions = drawQuestions(exam, QUESTIONS, Math.random, previousIds);
  const orders: Record<string, string[]> = {};
  for (const q of questions) {
    if (q.type === "mcq" || q.type === "scenario") orders[q.id] = shuffle(q.options.map((o) => o.id));
    else if (q.type === "match") orders[q.id] = shuffle(q.pairs.map((p) => p.id));
    else if (q.type === "order") {
      let o = shuffle(q.items.map((i) => i.id));
      if (o.length > 1 && o.every((id, i) => id === q.items[i].id)) o = [...o.slice(1), o[0]];
      orders[q.id] = o;
    }
  }
  return { questions, orders };
}

const TYPE_LABEL: Record<Question["type"], string> = {
  mcq: "چندگزینه‌ای",
  truefalse: "درست یا نادرست",
  match: "جورکردنی",
  order: "مرتب‌سازی",
  scenario: "موقعیت واقعی",
};

function useGuard(exam: Exam | undefined) {
  const { progress } = useProgress();
  if (!exam) return { allowed: false, reason: "missing" as const };
  if (exam.kind === "topic") return { allowed: !!exam.topicId && isTopicUnlocked(progress, exam.topicId), reason: "topic" as const };
  if (exam.kind === "checkpoint") {
    const i = SESSIONS.findIndex((s) => s.id === exam.sessionId);
    return { allowed: i >= 0 && isCheckpointUnlocked(progress, i), reason: "checkpoint" as const };
  }
  return { allowed: isCapstoneUnlocked(progress), reason: "capstone" as const };
}

export function ExamRunner({ examId }: { examId: string }) {
  const { ready } = useProgress();
  const exam = EXAMS[examId];
  const guard = useGuard(exam);

  if (!exam) {
    return (
      <Notice title="این آزمون پیدا نشد" action={{ href: "/map", label: "رفتن به نقشه یادگیری" }}>
        شاید هنوز آماده نشده یا نشانی اشتباه است.
      </Notice>
    );
  }
  if (!ready) return <Loading />;
  if (!guard.allowed) {
    const why =
      guard.reason === "topic"
        ? "اول باید درس‌های قبلی را بگذرانی تا این آزمون باز شود."
        : guard.reason === "checkpoint"
          ? "آزمون پایان جلسه وقتی باز می‌شود که آزمون همه‌ی درس‌های این جلسه را قبول شده باشی."
          : "آزمون پایانی وقتی باز می‌شود که چهار آزمون پایان جلسه را گذرانده باشی.";
    return (
      <Notice title="این آزمون هنوز قفل است 🔒" action={{ href: "/map", label: "بازگشت به نقشه" }}>
        {why} هر وقت آماده بودی، برگرد!
      </Notice>
    );
  }
  return <ExamBody exam={exam} />;
}

function ExamBody({ exam }: { exam: Exam }) {
  const { recordAttempt } = useProgress();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState(false);
  const [finished, setFinished] = useState<ReturnType<typeof scoreExam> | null>(null);
  const recorded = useRef(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const prevIds = useRef<string[] | undefined>(undefined);

  const start = useCallback(() => {
    const a = buildAttempt(exam, prevIds.current);
    prevIds.current = a.questions.map((q) => q.id);
    recorded.current = false;
    setAttempt(a);
    setQi(0);
    setAnswers({});
    setChecked(false);
    setFinished(null);
  }, [exam]);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (attempt) headRef.current?.focus();
  }, [qi, finished, attempt]);
  useEffect(() => {
    if (checked) nextRef.current?.focus();
  }, [checked]);

  if (!attempt) return <Loading />;
  if (attempt.questions.length === 0) {
    return (
      <Notice title="سؤال‌های این آزمون هنوز آماده نیستند" action={{ href: "/map", label: "بازگشت به نقشه" }}>
        بایتی هنوز دارد سؤال‌ها را می‌نویسد. کمی بعد دوباره سر بزن.
      </Notice>
    );
  }

  const total = attempt.questions.length;

  if (finished) {
    return <Results exam={exam} data={finished} onRetry={start} />;
  }

  const q = attempt.questions[qi];
  const ans = answers[q.id];
  const complete = isAnswerComplete(q, ans);
  const correct = checked && ans ? isCorrect(q, ans) : false;

  const setAnswer = (a: Answer) => !checked && setAnswers((s) => ({ ...s, [q.id]: a }));
  const goNext = () => {
    if (qi + 1 < total) {
      setQi(qi + 1);
      setChecked(false);
    } else {
      const res = scoreExam(exam, attempt.questions, answers);
      if (!recorded.current) {
        recorded.current = true; // one record per attempt, never on re-render
        recordAttempt(exam.id, exam.kind, res.attempt, res.results.map((r) => ({ concept: r.q.concept, correct: r.correct })));
      }
      setFinished(res);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-2 text-sm text-muted">{exam.title}</p>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1"><ProgressBar percent={(qi / total) * 100} label="پیشرفت آزمون" /></div>
        <span className="text-sm text-muted">سؤال {fa(qi + 1)} از {fa(total)}</span>
      </div>
      <section className="card p-6" aria-labelledby="q-title">
        <p className="mb-1 text-sm font-bold text-brand-ink">{TYPE_LABEL[q.type]}</p>
        {q.type === "scenario" && <p className="mb-3 rounded-2xl bg-sun-soft p-4">{q.scenario}</p>}
        <h1 id="q-title" ref={headRef} tabIndex={-1} className="mb-4 text-xl">{q.prompt}</h1>

        <QuestionInput q={q} order={attempt.orders[q.id]} ans={ans} disabled={checked} onChange={setAnswer} />

        <div aria-live="polite" role="status" className="mt-4">
          {checked && (
            <div className={`anim-pop rounded-2xl p-4 ${correct ? "bg-mint-soft text-mint-ink" : "bg-sun-soft text-[#5a4000]"}`}>
              <p className="font-bold">{correct ? "✅ آفرین، درست بود!" : "🤔 این بار نشد، ولی یاد گرفتن همین است!"}</p>
              {!correct && q.hint && <p className="mt-1">راهنمایی: {q.hint}</p>}
              <p className="mt-1">{q.explanation}</p>
              {!correct && (
                <Link href={`/topic/${q.topicId}`} className="mt-2 inline-block font-bold underline" target="_blank" rel="noopener">
                  مرور درس مربوط (در برگه‌ی جدید)
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          {!checked ? (
            <button type="button" className="btn btn-primary" disabled={!complete} onClick={() => setChecked(true)}>
              بررسی پاسخ
            </button>
          ) : (
            <button type="button" ref={nextRef} className="btn btn-primary" onClick={goNext}>
              {qi + 1 < total ? "سؤال بعدی" : "دیدن نتیجه"}
            </button>
          )}
        </div>
        {!complete && !checked && <p className="mt-2 text-end text-sm text-muted">اول پاسخت را انتخاب کن.</p>}
      </section>
    </div>
  );
}

function isAnswerComplete(q: Question, a?: Answer): boolean {
  if (!a) return false;
  if (q.type === "match" && a.type === "match") return q.pairs.every((p) => !!a.map[p.id]);
  return true;
}

function QuestionInput({ q, order, ans, disabled, onChange }: { q: Question; order: string[]; ans?: Answer; disabled: boolean; onChange: (a: Answer) => void }) {
  if (q.type === "mcq" || q.type === "scenario") {
    const sel = ans && "optionId" in ans ? ans.optionId : "";
    return (
      <fieldset disabled={disabled}>
        <legend className="sr-only-x">گزینه‌ها</legend>
        <div className="space-y-2">
          {order.map((id) => {
            const o = q.options.find((x) => x.id === id)!;
            const mark = disabled ? (id === q.correctId ? "✔ " : sel === id ? "✘ " : "") : "";
            return (
              <label key={id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 ${sel === id ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
                <input type="radio" name={q.id} className="h-5 w-5 accent-[var(--brand)]" checked={sel === id} onChange={() => onChange({ type: q.type, optionId: id })} />
                <span>{mark}{o.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }
  if (q.type === "truefalse") {
    const sel = ans && "value" in ans ? ans.value : undefined;
    return (
      <fieldset disabled={disabled}>
        <legend className="sr-only-x">درست یا نادرست</legend>
        <div className="grid grid-cols-2 gap-3">
          {[true, false].map((v) => (
            <label key={String(v)} className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 p-3 font-bold ${sel === v ? "border-brand bg-brand-soft" : "border-line bg-surface"}`}>
              <input type="radio" name={q.id} className="h-5 w-5 accent-[var(--brand)]" checked={sel === v} onChange={() => onChange({ type: "truefalse", value: v })} />
              {v ? "درست" : "نادرست"}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  if (q.type === "match") {
    const map = ans && "map" in ans ? ans.map : {};
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">برای هر مورد، گزینه‌ی مناسبش را از فهرست انتخاب کن.</p>
        {q.pairs.map((p) => (
          <div key={p.id} className="flex flex-col gap-1 rounded-2xl border border-line p-3 sm:flex-row sm:items-center sm:gap-3">
            <label htmlFor={`${q.id}-${p.id}`} className="flex-1 font-medium">{p.left}</label>
            <select id={`${q.id}-${p.id}`} className="field sm:w-1/2" disabled={disabled} value={map[p.id] ?? ""} onChange={(e) => onChange({ type: "match", map: { ...map, [p.id]: e.target.value } })}>
              <option value="">انتخاب کن…</option>
              {order.map((rid) => (
                <option key={rid} value={rid}>{q.pairs.find((x) => x.id === rid)!.right}</option>
              ))}
            </select>
            {disabled && <span aria-hidden className="text-lg">{map[p.id] === p.id ? "✔" : "✘"}</span>}
          </div>
        ))}
      </div>
    );
  }
  // order
  const ids = ans && "ids" in ans ? ans.ids : order;
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= ids.length) return;
    const c = [...ids];
    [c[i], c[j]] = [c[j], c[i]];
    onChange({ type: "order", ids: c });
  };
  return (
    <div>
      <p className="mb-2 text-sm text-muted">با دکمه‌های «بالا» و «پایین» موردها را به ترتیب درست بچین.</p>
      <ol className="space-y-2">
        {ids.map((id, i) => {
          const it = q.items.find((x) => x.id === id)!;
          return (
            <li key={id} className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft font-bold text-brand-ink">{fa(i + 1)}</span>
              <span className="flex-1">{it.text}</span>
              <button type="button" className="btn btn-ghost !px-3" disabled={disabled || i === 0} onClick={() => move(i, -1)} aria-label={`بردن «${it.text}» به بالا`}>▲</button>
              <button type="button" className="btn btn-ghost !px-3" disabled={disabled || i === ids.length - 1} onClick={() => move(i, 1)} aria-label={`بردن «${it.text}» به پایین`}>▼</button>
            </li>
          );
        })}
      </ol>
      {!ans && !disabled && (
        <button type="button" className="btn btn-ghost mt-3" onClick={() => onChange({ type: "order", ids })}>همین ترتیب را قبول دارم</button>
      )}
    </div>
  );
}

function Results({ exam, data, onRetry }: { exam: Exam; data: ReturnType<typeof scoreExam>; onRetry: () => void }) {
  const { attempt, results, correctCount, scorePercent } = data;
  const headRef = useRef<HTMLHeadingElement>(null);
  const total = results.length;
  const missed = results.filter((r) => !r.correct);
  const next = useMemo(() => {
    if (exam.kind === "topic" && exam.topicId) return afterTopic(exam.topicId);
    if (exam.kind === "checkpoint") return { href: "/map", label: "بازگشت به نقشه" };
    return { href: "/profile", label: "دیدن دستاوردها" };
  }, [exam]);
  const topic = exam.topicId ? TOPICS[exam.topicId] : undefined;

  return (
    <div className="mx-auto max-w-2xl">
      <section className="card p-6 text-center" aria-labelledby="res-title">
        <Mascot size={110} mood={attempt.passed ? "cheer" : "think"} className="mx-auto" />
        <h1 id="res-title" ref={headRef} tabIndex={-1} className="mt-2 text-3xl">
          {attempt.passed ? "عالی بود! قبول شدی 🎉" : "کم مانده! دوباره امتحان می‌کنیم 💪"}
        </h1>
        <p className="mt-2 text-5xl font-bold text-brand-ink" aria-label={`نمره ${fa(scorePercent)} درصد`}>{fa(scorePercent)}٪</p>
        <p className="text-muted">{fa(correctCount)} پاسخ درست از {fa(total)} · حد نصاب قبولی {fa(exam.passPercent)}٪</p>
        <p className="mt-2">
          {attempt.passed
            ? "درس بعدی برایت باز شد. می‌توانی هر وقت خواستی دوباره تمرین کنی."
            : "اشکالی ندارد! هر اشتباه یک فرصت یادگیری است. می‌توانی بی‌نهایت بار تلاش کنی."}
        </p>
        <div role="status" className="sr-only-x">{attempt.passed ? "قبول شدی" : "هنوز قبول نشدی"}</div>
      </section>

      {attempt.missedConcepts.length > 0 && (
        <section className="card mt-4 p-6">
          <h2 className="text-xl">مفهوم‌هایی که کمی تمرین می‌خواهند</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {attempt.missedConcepts.map((c) => <li key={c} className="rounded-full bg-sun-soft px-3 py-1 text-[#5a4000]">{c}</li>)}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            {topic && <Link href={`/topic/${topic.id}`} className="btn btn-ghost">مرور درس</Link>}
            <Link href="/review" className="btn btn-ghost">مرکز مرور</Link>
          </div>
        </section>
      )}

      <section className="card mt-4 p-6">
        <h2 className="mb-3 text-xl">مرور پاسخ‌ها</h2>
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={r.q.id} className={`rounded-2xl p-3 ${r.correct ? "bg-mint-soft" : "bg-sun-soft"}`}>
              <p className="font-bold">{r.correct ? "✔ درست" : "✘ نیاز به مرور"} — {r.q.prompt}</p>
              <p className="text-sm">{r.q.explanation}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" className="btn btn-sun" onClick={onRetry}>{attempt.passed ? "تمرین دوباره" : "تلاش دوباره"}</button>
        {attempt.passed && next && <Link href={next.href} className="btn btn-primary">{next.label}</Link>}
        <Link href="/map" className="btn btn-ghost">نقشه یادگیری</Link>
      </div>
      {missed.length === 0 && <p className="mt-4 text-center text-muted">همه را درست جواب دادی!</p>}
    </div>
  );
}
