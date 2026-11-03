"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProgress } from "./ProgressProvider";
import { avatarOf, fa } from "./ui";

const NAV = [
  { href: "/", label: "خانه", icon: "🏠" },
  { href: "/map", label: "نقشه یادگیری", icon: "🗺️" },
  { href: "/glossary", label: "واژه‌نامه", icon: "📖" },
  { href: "/review", label: "مرور", icon: "🔁" },
  { href: "/profile", label: "پروفایل", icon: "⭐" },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const { progress, ready, storageOk } = useProgress();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const av = progress.profile ? avatarOf(progress.profile.avatar) : null;

  return (
    <>
      <a href="#main" className="skip-link">پرش به محتوای اصلی</a>
      <header className="sticky top-0 z-40 hidden border-b border-line bg-surface/95 backdrop-blur md:block">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-brand-ink">
            <span aria-hidden>🤖</span> بایت‌بادی‌ها
          </Link>
          <nav aria-label="منوی اصلی" className="flex flex-1 items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(path, n.href) ? "page" : undefined}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 font-medium ${isActive(path, n.href) ? "bg-brand text-white" : "text-ink hover:bg-brand-soft"}`}
              >
                <span aria-hidden>{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </nav>
          {ready && progress.profile && (
            <Link href="/profile" className="flex min-h-11 items-center gap-2 rounded-full bg-sun-soft px-4 font-bold text-[#5a4000]" aria-label={`${progress.profile.nickname}، ${fa(progress.xp)} امتیاز`}>
              <span aria-hidden>{av?.emoji}</span>
              <span>{fa(progress.xp)} امتیاز</span>
            </Link>
          )}
        </div>
      </header>

      {!storageOk && (
        <div role="alert" className="bg-coral-soft px-4 py-2 text-center text-coral-ink">
          ذخیره‌سازی مرورگر در دسترس نیست؛ می‌توانی یاد بگیری، اما پیشرفتت بعد از بستن صفحه ذخیره نمی‌شود.
        </div>
      )}
      {!online && (
        <div role="status" className="bg-sky-soft px-4 py-2 text-center text-[#0b4a73]">
          اینترنت وصل نیست، اما بایت‌بادی‌ها بدون اینترنت هم کار می‌کند.
        </div>
      )}

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-6 md:pb-12">
        {children}
      </main>

      <footer className="mx-auto hidden max-w-6xl px-6 pb-8 text-center text-sm text-muted md:block">
        همه‌ی پیشرفت تو فقط روی همین دستگاه ذخیره می‌شود. <Link href="/parents" className="underline">بخش والدین و مربیان</Link>
      </footer>

      <nav aria-label="منوی پایین" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="mx-auto flex max-w-xl justify-around">
          {NAV.map((n) => (
            <li key={n.href} className="flex-1">
              <Link
                href={n.href}
                aria-current={isActive(path, n.href) ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-xs font-medium ${isActive(path, n.href) ? "text-brand-ink" : "text-muted"}`}
              >
                <span aria-hidden className={`rounded-full px-4 py-0.5 text-lg ${isActive(path, n.href) ? "bg-brand-soft" : ""}`}>{n.icon}</span>
                <span className="leading-tight">{n.label.replace("نقشه یادگیری", "نقشه")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
