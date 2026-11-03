import Link from "next/link";
import type { AgeBand, AgeText } from "@/lib/types";
import { Mascot } from "./Mascot";

export const fa = (n: number) => n.toLocaleString("fa-IR");

export function pickText(t: AgeText, band: AgeBand): string {
  return (band === "7-10" ? t.young : t.older) ?? t.base;
}

export const AVATARS = [
  { id: "robot", emoji: "🤖", name: "ربات" },
  { id: "rocket", emoji: "🚀", name: "موشک" },
  { id: "cat", emoji: "🐱", name: "گربه" },
  { id: "fox", emoji: "🦊", name: "روباه" },
  { id: "panda", emoji: "🐼", name: "پاندا" },
  { id: "owl", emoji: "🦉", name: "جغد" },
  { id: "dino", emoji: "🦖", name: "دایناسور" },
  { id: "alien", emoji: "👾", name: "موجود فضایی" },
] as const;

export function avatarOf(id?: string) {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

/** Paragraphs separated by blank lines. */
export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} className="mb-3 last:mb-0">
          {p}
        </p>
      ))}
    </>
  );
}

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p} aria-valuetext={`${fa(p)} درصد`}>
      <div className="progress-fill" style={{ width: `${p}%` }} />
    </div>
  );
}

export function Loading({ label = "در حال بارگذاری…" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-muted">
      <Mascot size={96} mood="think" />
      <p>{label}</p>
    </div>
  );
}

export function Notice({
  title,
  children,
  action,
  mood = "think",
}: {
  title: string;
  children?: React.ReactNode;
  action?: { href: string; label: string };
  mood?: "happy" | "think" | "cheer";
}) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center gap-3 p-8 text-center">
      <Mascot size={110} mood={mood} />
      <h1 className="text-2xl">{title}</h1>
      {children && <div className="text-muted">{children}</div>}
      {action && (
        <Link href={action.href} className="btn btn-primary mt-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  );
}
