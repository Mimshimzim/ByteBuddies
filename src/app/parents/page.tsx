"use client";
import { EXAMS, SESSIONS, TOPICS, topicExamId } from "@/content";
import { useAchievements } from "@/hooks/useAchievements";
import { useProgress } from "@/components/ProgressProvider";
import { sessionProgress, sessionTopics } from "@/components/curriculum";
import { Loading, PageTitle, ProgressBar, fa } from "@/components/ui";

export default function ParentsPage() {
  const { progress, ready } = useProgress();
  const badges = useAchievements();
  if (!ready) return <Loading />;
  const passed = Object.values(TOPICS).filter((t) => progress.exams[topicExamId(t.id)]?.passed);
  const weak = Object.keys(progress.weakConcepts);
  const totalAttempts = Object.values(progress.exams).reduce((n, e) => n + e.attempts.length, 0);
  return (
    <div>
      <PageTitle title="بخش والدین و مربیان" subtitle="خلاصه‌ی فقط‌خواندنی از یادگیری کودک. این اطلاعات فقط روی همین دستگاه ذخیره شده است." />
      <section className="card p-5">
        <h2 className="text-xl">{progress.profile ? `پیشرفت ${progress.profile.nickname}` : "هنوز پروفایلی ساخته نشده"}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-center md:grid-cols-4">
          {[["امتیاز", progress.xp], ["درس‌های قبول‌شده", passed.length], ["تعداد تلاش‌ها", totalAttempts], ["نشان‌ها", badges.filter((b) => b.earnedAt).length]].map(([k, v]) => (
            <div key={k as string} className="rounded-2xl bg-brand-soft p-3"><dt className="text-sm">{k}</dt><dd className="text-2xl font-bold">{fa(v as number)}</dd></div>
          ))}
        </dl>
      </section>

      <section className="card mt-5 p-5">
        <h2 className="mb-3 text-xl">پیشرفت جلسه‌ها</h2>
        <div className="space-y-4">
          {SESSIONS.map((s) => {
            const sp = sessionProgress(progress, s);
            return (
              <div key={s.id}>
                <p className="mb-1">{s.title} — {fa(sp.done)} از {fa(sp.total)} درس</p>
                <ProgressBar percent={sp.percent} label={s.title} />
                <ul className="mt-2 text-sm text-muted">
                  {sessionTopics(s).core.map((t) => {
                    const e = progress.exams[topicExamId(t.id)];
                    return <li key={t.id}>{t.title}: {e ? `${e.passed ? "قبول" : "در حال تمرین"} (بهترین نمره ${fa(e.bestPercent)}٪، ${fa(e.attempts.length)} تلاش)` : "شروع نشده"}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-xl">نقاط قوت 💪</h2>
          {passed.length ? <ul className="mt-2 list-disc ps-6">{passed.map((t) => <li key={t.id}>{t.title}</li>)}</ul> : <p className="mt-2 text-muted">با گذراندن درس‌ها اینجا پر می‌شود.</p>}
        </section>
        <section className="card p-5">
          <h2 className="text-xl">نیازمند تمرین بیشتر 🌱</h2>
          {weak.length ? <ul className="mt-2 list-disc ps-6">{weak.map((c) => <li key={c}>{c}</li>)}</ul> : <p className="mt-2 text-muted">فعلاً موردی نیست.</p>}
        </section>
      </div>

      <section className="card mt-5 p-5">
        <h2 className="text-xl">پیشنهاد تمرین بدون صفحه‌نمایش</h2>
        <ul className="mt-2 list-disc ps-6">
          <li>از کودک بخواهید اجزای رایانه‌ی خانه (ورودی، خروجی، ذخیره‌سازی) را نام ببرد و نقششان را توضیح دهد.</li>
          <li>روی کاغذ یک «درخت پوشه» از اتاق خودش بکشد: اتاق، کمد، کشو، لباس‌ها.</li>
          <li>با هم درباره‌ی رمز عبور قوی و اینکه به چه کسی نباید گفت، گفت‌وگو کنید.</li>
          <li>مراحل یک کار روزمره (مثل ساختن ساندویچ) را مثل الگوریتم مرحله‌به‌مرحله بنویسد.</li>
        </ul>
        {Object.keys(EXAMS).length === 0 && <p className="mt-2 text-sm text-muted">آزمون‌ها به‌زودی اضافه می‌شوند.</p>}
      </section>
    </div>
  );
}
