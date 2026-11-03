"use client";
import Link from "next/link";
import { SESSIONS } from "@/content";
import { Mascot } from "@/components/Mascot";
import { useProgress } from "@/components/ProgressProvider";
import { PENDING_SESSIONS, nextTopicToLearn, overallProgress } from "@/components/curriculum";
import { ProgressBar, fa } from "@/components/ui";

const BENEFITS = [
  { icon: "🎮", title: "یادگیری مثل بازی", text: "درس کوتاه، تمرین عملی و آزمون دوستانه؛ بدون ترس از اشتباه." },
  { icon: "🧪", title: "تمرین امن", text: "همه چیز شبیه‌سازی است؛ هیچ چیز روی رایانه‌ی واقعی تو تغییر نمی‌کند." },
  { icon: "🔒", title: "خصوصی و بدون ثبت‌نام", text: "فقط یک اسم مستعار می‌خواهیم و پیشرفتت روی همین دستگاه می‌ماند." },
  { icon: "🌱", title: "آماده‌ی برنامه‌نویسی", text: "پایه‌های لازم برای قدم بعدی، یعنی برنامه‌نویسی را می‌سازی." },
];

export default function Home() {
  const { progress, ready } = useProgress();
  const hasProfile = ready && !!progress.profile;
  const cont = hasProfile ? nextTopicToLearn(progress) : undefined;
  const overall = overallProgress(progress);
  const cta = hasProfile
    ? { href: cont ? `/topic/${cont.id}` : "/map", label: cont ? `ادامه: ${cont.title}` : "رفتن به نقشه یادگیری" }
    : { href: "/start", label: "شروع یادگیری" };

  return (
    <div className="space-y-14">
      <section className="card grid items-center gap-6 overflow-hidden bg-gradient-to-br from-brand-soft via-surface to-sun-soft p-6 md:grid-cols-[1fr_auto] md:p-12">
        <div>
          <p className="mb-2 font-bold text-brand-ink">برای ۷ تا ۱۴ سال</p>
          <h1 className="text-3xl md:text-5xl">{hasProfile ? `سلام ${progress.profile!.nickname}! 👋` : "رایانه را با بایتی کشف کن!"}</h1>
          <p className="mt-3 max-w-xl text-lg text-muted">
            با هم یاد می‌گیریم رایانه چطور کار می‌کند، فایل‌ها را مرتب کنیم، امن بمانیم و با اینترنت آشنا شویم؛ قدم‌به‌قدم و با تمرین.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={cta.href} className="btn btn-primary !min-h-14 text-lg">{cta.label}</Link>
            {hasProfile && <Link href="/map" className="btn btn-ghost !min-h-14">نقشه یادگیری</Link>}
          </div>
          {hasProfile && overall.total > 0 && (
            <div className="mt-6 max-w-sm">
              <p className="mb-1 text-sm text-muted">پیشرفت کل: {fa(Math.round(overall.percent))}٪</p>
              <ProgressBar percent={overall.percent} label="پیشرفت کل دوره" />
            </div>
          )}
        </div>
        <Mascot size={200} mood="cheer" className="mx-auto" />
      </section>

      <section aria-labelledby="why">
        <h2 id="why" className="mb-4 text-2xl">چرا بایت‌بادی‌ها؟</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <li key={b.title} className="card p-5">
              <div aria-hidden className="mb-2 text-3xl">{b.icon}</div>
              <h3 className="text-lg">{b.title}</h3>
              <p className="mt-1 text-muted">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="path">
        <h2 id="path" className="mb-4 text-2xl">چهار سفر یادگیری</h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {SESSIONS.map((s) => (
            <li key={s.id} className="card flex items-start gap-4 p-5">
              <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sun-soft text-3xl">{s.icon}</span>
              <div>
                <h3 className="text-lg">{s.title}</h3>
                <p className="text-muted">{s.tagline}</p>
              </div>
            </li>
          ))}
          {PENDING_SESSIONS.filter((p) => !SESSIONS.some((s) => s.order === p.order)).map((p) => (
            <li key={p.order} className="card flex items-start gap-4 p-5 opacity-80">
              <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-3xl">{p.icon}</span>
              <div>
                <h3 className="text-lg">{p.title}</h3>
                <p className="text-muted">به‌زودی باز می‌شود</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
