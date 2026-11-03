"use client";
import Link from "next/link";
import { useState } from "react";
import { EXAMS } from "@/content";
import { useAchievements } from "@/hooks/useAchievements";
import { useProgress } from "@/components/ProgressProvider";
import { Loading, Notice, PageTitle, avatarOf, fa } from "@/components/ui";

export default function ProfilePage() {
  const { progress, ready, streakDays, resetAll } = useProgress();
  const badges = useAchievements();
  const [confirm, setConfirm] = useState(false);
  if (!ready) return <Loading />;
  if (!progress.profile) {
    return <Notice title="اول خودت را معرفی کن" action={{ href: "/start", label: "ساخت پروفایل" }}>برای دیدن امتیاز و نشان‌ها یک اسم مستعار و شخصیت انتخاب کن.</Notice>;
  }
  const p = progress.profile;
  const earned = badges.filter((b) => b.earnedAt);
  const attempts = Object.entries(progress.exams).filter(([, e]) => e.attempts.length > 0);

  return (
    <div>
      <PageTitle title="پروفایل من" />
      <section className="card flex flex-wrap items-center gap-5 p-6">
        <span aria-hidden className="grid h-24 w-24 place-items-center rounded-3xl bg-brand-soft text-6xl">{avatarOf(p.avatar).emoji}</span>
        <div className="flex-1">
          <h2 className="text-2xl">{p.nickname}</h2>
          <p className="text-muted">گروه سنی: {p.ageBand === "7-10" ? "۷ تا ۱۰ سال" : "۱۱ تا ۱۴ سال"}</p>
          <Link href="/start" className="btn btn-ghost mt-2">ویرایش پروفایل</Link>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-2xl bg-sun-soft p-3"><dt className="text-sm">امتیاز</dt><dd className="text-2xl font-bold">{fa(progress.xp)}</dd></div>
          <div className="rounded-2xl bg-mint-soft p-3"><dt className="text-sm">نشان‌ها</dt><dd className="text-2xl font-bold">{fa(earned.length)}</dd></div>
        </dl>
      </section>

      <p className="mt-4 rounded-2xl bg-sky-soft p-4 text-[#0b4a73]">
        🌱 {streakDays > 1 ? `این ${fa(streakDays)} روز پشت‌سرهم سر زده‌ای. عالیه! ولی اگر یک روز نیامدی هم اشکالی ندارد؛ هر وقت دلت خواست برگرد.` : "هر وقت دلت خواست برگرد؛ بایتی همیشه منتظر توست. هیچ عجله‌ای نیست."}
      </p>

      <section className="mt-8" aria-labelledby="badges">
        <h2 id="badges" className="mb-3 text-2xl">نشان‌ها</h2>
        {badges.length === 0 ? (
          <p className="card p-5 text-muted">نشان‌ها با پیشرفت در درس‌ها اینجا ظاهر می‌شوند.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {badges.map((b) => (
              <li key={b.id} className={`card p-4 text-center ${b.earnedAt ? "" : "opacity-60"}`}>
                <div aria-hidden className={`text-4xl ${b.earnedAt ? "" : "grayscale"}`}>{b.icon}</div>
                <h3 className="text-base">{b.title}</h3>
                <p className="text-sm text-muted">{b.description}</p>
                <p className="mt-1 text-sm font-bold">{b.earnedAt ? "✔ گرفته‌ای" : "🔒 هنوز نه"}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8" aria-labelledby="att">
        <h2 id="att" className="mb-3 text-2xl">آزمون‌ها و تلاش‌ها</h2>
        {attempts.length === 0 ? (
          <p className="card p-5 text-muted">هنوز آزمونی نداده‌ای. اولین درس را شروع کن!</p>
        ) : (
          <ul className="space-y-2">
            {attempts.map(([id, e]) => (
              <li key={id} className="card flex flex-wrap items-center justify-between gap-2 p-4">
                <span className="font-bold">{EXAMS[id]?.title ?? id}</span>
                <span>{fa(e.attempts.length)} تلاش · بهترین نمره {fa(e.bestPercent)}٪ · {e.passed ? "✔ قبول" : "در حال تمرین"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card mt-10 p-5" aria-labelledby="reset">
        <h2 id="reset" className="text-lg">شروع دوباره از صفر</h2>
        <p className="text-muted">با این کار همه‌ی پیشرفت، امتیاز و نشان‌ها از همین دستگاه پاک می‌شود. پروفایل هم پاک می‌شود.</p>
        {!confirm ? (
          <button type="button" className="btn btn-ghost mt-3" onClick={() => setConfirm(true)}>پاک کردن همه‌ی پیشرفت</button>
        ) : (
          <div role="alert" className="mt-3 flex flex-wrap items-center gap-3">
            <strong>مطمئنی؟ این کار برگشت ندارد.</strong>
            <button type="button" className="btn bg-coral-ink text-white" onClick={() => { resetAll(); setConfirm(false); }}>بله، پاک کن</button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirm(false)}>نه، پشیمان شدم</button>
          </div>
        )}
      </section>
    </div>
  );
}
