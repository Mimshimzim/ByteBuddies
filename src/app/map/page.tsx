"use client";
import Link from "next/link";
import { EXAMS, SESSIONS } from "@/content";
import { isExamPassed } from "@/lib/progress";
import { isCapstoneUnlocked, isCheckpointUnlocked } from "@/lib/unlock";
import { useProgress } from "@/components/ProgressProvider";
import { NodeState, PENDING_SESSIONS, STATE_LABEL, overallProgress, sessionProgress, sessionTopics, topicState } from "@/components/curriculum";
import { Loading, PageTitle, ProgressBar, fa } from "@/components/ui";

const ICON: Record<NodeState, string> = { locked: "🔒", open: "▶️", done: "✅" };
const STYLE: Record<NodeState, string> = {
  locked: "border-line bg-bg text-muted",
  open: "border-brand bg-brand-soft text-ink",
  done: "border-mint bg-mint-soft text-ink",
};

function Node({ href, title, sub, state, label }: { href: string; title: string; sub?: string; state: NodeState; label?: string }) {
  return (
    <li>
      <Link href={href} className={`flex min-h-16 items-center gap-3 rounded-2xl border-2 p-3 ${STYLE[state]}`}>
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-lg shadow">{ICON[state]}</span>
        <span className="flex-1">
          <span className="block font-bold">{label && <span className="me-1 text-sm font-medium text-brand-ink">{label}</span>}{title}</span>
          {sub && <span className="block text-sm text-muted">{sub}</span>}
        </span>
        <span className="rounded-full bg-surface px-3 py-0.5 text-sm font-bold">{STATE_LABEL[state]}</span>
      </Link>
    </li>
  );
}

export default function MapPage() {
  const { progress, ready } = useProgress();
  if (!ready) return <Loading />;
  const overall = overallProgress(progress);
  const cap = EXAMS["capstone"];

  return (
    <div>
      <PageTitle title="نقشه یادگیری" subtitle="از اولین جزیره شروع کن؛ با قبول شدن در آزمون هر درس، درس بعدی باز می‌شود." />
      {!progress.profile && (
        <p className="mb-4 rounded-2xl bg-sun-soft p-4">
          هنوز خودت را معرفی نکرده‌ای. <Link href="/start" className="font-bold underline">یک اسم و شخصیت انتخاب کن</Link> تا توضیح‌ها با سنت هماهنگ شوند.
        </p>
      )}
      <div className="card mb-6 p-4">
        <p className="mb-1 font-bold">پیشرفت کل: {fa(Math.round(overall.percent))}٪ ({fa(overall.done)} از {fa(overall.total)} درس)</p>
        <ProgressBar percent={overall.percent} label="پیشرفت کل دوره" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {SESSIONS.map((s, si) => {
          const sp = sessionProgress(progress, s);
          const { core, enrichment } = sessionTopics(s);
          const cpId = s.checkpointExamId;
          const cpExists = !!cpId && !!EXAMS[cpId];
          const cpState: NodeState = isExamPassed(progress, cpId) ? "done" : isCheckpointUnlocked(progress, si) ? "open" : "locked";
          return (
            <section key={s.id} className="card p-5" aria-labelledby={`s-${s.id}`}>
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-14 w-14 place-items-center rounded-2xl bg-sun-soft text-3xl">{s.icon}</span>
                <div>
                  <h2 id={`s-${s.id}`} className="text-xl">{s.title}</h2>
                  <p className="text-sm text-muted">{s.tagline}</p>
                </div>
              </div>
              <div className="my-3">
                <p className="mb-1 text-sm">{fa(sp.done)} از {fa(sp.total)} درس · {fa(Math.round(sp.percent))}٪</p>
                <ProgressBar percent={sp.percent} label={`پیشرفت ${s.title}`} />
              </div>
              {core.length === 0 && <p className="rounded-2xl bg-bg p-4 text-muted">درس‌های این جلسه به‌زودی اضافه می‌شود.</p>}
              <ol className="space-y-2">
                {core.map((t, i) => (
                  <Node key={t.id} href={`/topic/${t.id}`} title={t.title} sub={`${fa(t.minutes)} دقیقه`} label={`${fa(i + 1)}.`} state={topicState(progress, t.id)} />
                ))}
                {cpExists && (
                  <Node href={`/exam/${cpId}`} title="آزمون پایان جلسه" sub="همه‌ی درس‌های این جلسه را مرور کن" label="🏁" state={cpState} />
                )}
              </ol>
              {enrichment.length > 0 && (
                <div className="mt-4">
                  <h3 className="mb-2 text-base text-muted">ماجراجویی‌های اختیاری</h3>
                  <ul className="space-y-2">
                    {enrichment.map((t) => (
                      <Node key={t.id} href={`/topic/${t.id}`} title={t.title} sub={`${fa(t.minutes)} دقیقه · اختیاری`} state={topicState(progress, t.id)} />
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
        {PENDING_SESSIONS.filter((p) => !SESSIONS.some((s) => s.order === p.order)).map((p) => (
          <section key={p.order} className="card p-5 opacity-80" aria-label={p.title}>
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-3xl">{p.icon}</span>
              <div>
                <h2 className="text-xl">{p.title}</h2>
                <p className="text-sm text-muted">🔒 به‌زودی باز می‌شود</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="card mt-6 p-5">
        <h2 className="text-xl">🏆 پروژه‌ی پایانی و گواهی</h2>
        {cap ? (
          <ul className="mt-3"><Node href="/exam/capstone" title={cap.title} state={isExamPassed(progress, "capstone") ? "done" : isCapstoneUnlocked(progress) ? "open" : "locked"} /></ul>
        ) : (
          <p className="mt-2 text-muted">بعد از گذراندن هر چهار جلسه، پروژه‌ی پایانی و گواهی تو اینجا باز می‌شود.</p>
        )}
      </section>
    </div>
  );
}
