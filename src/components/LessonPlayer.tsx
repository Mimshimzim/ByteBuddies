"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EXAMS, GLOSSARY, TOPICS, topicExamId } from "@/content";
import { isExamPassed } from "@/lib/progress";
import { isTopicUnlocked } from "@/lib/unlock";
import { Diagram } from "./diagrams";
import { LabHost } from "./LabHost";
import { Ltr } from "./Ltr";
import { Mascot } from "./Mascot";
import { useProgress } from "./ProgressProvider";
import { afterTopic } from "./curriculum";
import { Loading, Notice, Paragraphs, ProgressBar, fa, pickText } from "./ui";

const KIND_LABEL: Record<string, string> = { intro: "شروع", explain: "توضیح", demo: "نمایش", activity: "فعالیت", recap: "مرور" };

function TermChips({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const terms = ids.map((id) => GLOSSARY.find((g) => g.id === id)).filter((g) => !!g);
  if (!terms.length) return null;
  const active = terms.find((t) => t!.id === open);
  return (
    <section aria-label="واژه‌های مهم" className="mt-5">
      <h3 className="mb-2 text-base text-muted">واژه‌های مهم (روی هر کدام بزن)</h3>
      <div className="flex flex-wrap gap-2">
        {terms.map((t) => (
          <button key={t!.id} type="button" className="chip" aria-expanded={open === t!.id} aria-controls="term-pop" onClick={() => setOpen(open === t!.id ? null : t!.id)}>
            {t!.term}
            {t!.latin && <Ltr className="text-sm opacity-80">({t!.latin})</Ltr>}
          </button>
        ))}
      </div>
      <div id="term-pop" aria-live="polite">
        {active && (
          <div className="card anim-pop mt-3 border-brand p-4">
            <strong>{active.term}</strong>
            {active.latin && <> <Ltr className="text-muted">({active.latin})</Ltr></>}
            <p className="mt-1">{active.definition}</p>
            <button type="button" className="btn btn-ghost mt-2 !min-h-11" onClick={() => setOpen(null)}>بستن</button>
          </div>
        )}
      </div>
    </section>
  );
}

export function LessonPlayer({ topicId }: { topicId: string }) {
  const { progress, ready, ageBand, completeStep } = useProgress();
  const topic = TOPICS[topicId];
  // -1 = overview, 0..n-1 = steps, n = recap/finish
  const [idx, setIdx] = useState(-1);
  const [moreOpen, setMoreOpen] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus();
    window.scrollTo({ top: 0 });
    setMoreOpen(false);
  }, [idx]);

  if (!topic) {
    return (
      <Notice title="این درس پیدا نشد" action={{ href: "/map", label: "رفتن به نقشه یادگیری" }}>
        شاید نشانی را اشتباه وارد کرده‌ای. از نقشه یادگیری درس مورد نظرت را انتخاب کن.
      </Notice>
    );
  }
  if (!ready) return <Loading />;

  if (!isTopicUnlocked(progress, topicId)) {
    return (
      <Notice title="این درس هنوز قفل است 🔒" action={{ href: "/map", label: "بازگشت به نقشه" }}>
        برای باز شدن «{topic.title}» باید اول درس‌ها و آزمون‌های قبلی را با موفقیت بگذرانی. نگران نباش، تا هر وقت بخواهی می‌توانی دوباره تلاش کنی!
      </Notice>
    );
  }

  const n = topic.steps.length;
  const step = idx >= 0 && idx < n ? topic.steps[idx] : null;
  const examId = topicExamId(topicId);
  const examExists = !!EXAMS[examId];
  const passed = isExamPassed(progress, examId);
  const done = new Set(progress.stepsDone[topicId] ?? []);
  const percent = idx < 0 ? 0 : (Math.min(idx + 1, n) / n) * 100;

  const go = (to: number) => {
    if (step) completeStep(topicId, step.id);
    setIdx(to);
  };
  const next = afterTopic(topicId);

  return (
    <article className="mx-auto max-w-3xl">
      <nav aria-label="مسیر" className="mb-3 text-sm text-muted">
        <Link href="/map" className="underline">نقشه یادگیری</Link> / {topic.title}
      </nav>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar percent={percent} label="پیشرفت درس" />
        </div>
        <span className="text-sm text-muted">
          {idx < 0 ? "شروع" : idx >= n ? "پایان" : `گام ${fa(idx + 1)} از ${fa(n)}`}
        </span>
      </div>

      {idx < 0 && (
        <section className="card p-6">
          <h1 ref={headRef} tabIndex={-1} className="text-3xl">{topic.title}</h1>
          <p className="mt-1 text-lg text-muted">{topic.purpose}</p>
          <p className="mt-2 text-sm">⏱️ حدود {fa(topic.minutes)} دقیقه {passed && <span className="ms-2 rounded-full bg-mint-soft px-3 py-0.5 font-bold text-mint-ink">✔ آزمون قبول شد</span>}</p>
          <h2 className="mt-5 text-xl">در این درس یاد می‌گیریم</h2>
          <ul className="mt-2 list-disc ps-6">{topic.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          <h2 className="mt-5 text-xl">چرا مهم است؟</h2>
          <div className="mt-2 rounded-2xl bg-sun-soft p-4"><Paragraphs text={pickText(topic.whyItMatters, ageBand)} /></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => setIdx(0)}>بزن بریم!</button>
          </div>
        </section>
      )}

      {step && (
        <section className="card p-6" aria-labelledby="step-title">
          <p className="mb-1 text-sm font-bold text-brand-ink">{KIND_LABEL[step.kind] ?? ""}</p>
          <h1 id="step-title" ref={headRef} tabIndex={-1} className="mb-3 text-2xl">{step.title}</h1>
          <div className="text-lg"><Paragraphs text={pickText(step.body, ageBand)} /></div>
          {step.visual && (
            <figure className="mt-4 rounded-2xl border border-line bg-bg p-3">
              <Diagram name={step.visual.diagram} />
              <figcaption className="mt-2 text-center text-sm text-muted">{step.visual.alt}</figcaption>
            </figure>
          )}
          {step.labId && (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-brand p-3">
              <h2 className="mb-2 text-lg">🧪 تمرین عملی (کاملاً امن و شبیه‌سازی‌شده)</h2>
              <LabHost labId={step.labId} onComplete={() => completeStep(topicId, step.id)} />
            </div>
          )}
          {step.termIds && <TermChips key={step.id} ids={step.termIds} />}
          {step.more && (
            <div className="mt-5">
              <button type="button" className="chip" aria-expanded={moreOpen} aria-controls="more-panel" onClick={() => setMoreOpen(!moreOpen)}>
                🔍 بیشتر بدانیم
              </button>
              {moreOpen && (
                <div id="more-panel" className="anim-pop mt-3 rounded-2xl bg-sky-soft p-4">
                  <Paragraphs text={step.more} />
                </div>
              )}
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => setIdx(idx - 1)}>قبلی</button>
            <span className="text-sm text-muted" aria-live="polite">{done.has(step.id) ? "✔ این گام انجام شده" : ""}</span>
            <button type="button" className="btn btn-primary" onClick={() => go(idx + 1)}>
              {idx === n - 1 ? "پایان گام‌ها" : "بعدی"}
            </button>
          </div>
        </section>
      )}

      {idx >= n && (
        <section className="card p-6">
          <div className="flex items-center gap-4">
            <Mascot size={90} mood="cheer" />
            <div>
              <h1 ref={headRef} tabIndex={-1} className="text-2xl">مرور سریع</h1>
              <p className="text-muted">آفرین! این نکته‌های مهم را به خاطر بسپار.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {topic.recap.map((r) => (
              <li key={r} className="flex gap-2 rounded-xl bg-mint-soft p-3"><span aria-hidden>✅</span>{r}</li>
            ))}
          </ul>
          <TermChips key="recap-terms" ids={topic.termIds} />
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={() => setIdx(n - 1)}>برگشت به گام آخر</button>
            {examExists ? (
              <Link href={`/exam/${examId}`} className="btn btn-sun">{passed ? "دوباره آزمون بده" : "برویم سراغ آزمون این درس"}</Link>
            ) : (
              <span className="rounded-xl bg-sun-soft p-3">آزمون این درس به‌زودی آماده می‌شود.</span>
            )}
            {passed && next && <Link href={next.href} className="btn btn-primary">{next.label}</Link>}
          </div>
        </section>
      )}
    </article>
  );
}
