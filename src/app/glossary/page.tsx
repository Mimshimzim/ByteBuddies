"use client";
import { useMemo, useState } from "react";
import { GLOSSARY, TOPICS } from "@/content";
import Link from "next/link";
import { Ltr } from "@/components/Ltr";
import { PageTitle, fa } from "@/components/ui";
import type { GlossaryTerm } from "@/lib/types";

const CATS: Record<GlossaryTerm["category"], string> = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  files: "فایل‌ها",
  security: "امنیت",
  network: "شبکه",
  thinking: "تفکر",
};

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (g) => (cat === "all" || g.category === cat) && (!s || g.term.includes(s) || g.definition.includes(s) || (g.latin ?? "").toLowerCase().includes(s)),
    ).sort((a, b) => a.term.localeCompare(b.term, "fa"));
  }, [q, cat]);

  return (
    <div>
      <PageTitle title="واژه‌نامه" subtitle="واژه‌های رایانه‌ای را اینجا جست‌وجو کن." />
      <div className="card mb-5 p-4">
        <label htmlFor="gs" className="mb-1 block font-bold">جست‌وجو</label>
        <input id="gs" type="search" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="مثلاً: پردازنده یا CPU" />
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="دسته‌بندی">
          <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>همه</button>
          {(Object.keys(CATS) as (keyof typeof CATS)[]).map((c) => (
            <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{CATS[c]}</button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-muted" role="status">{fa(list.length)} واژه</p>
      {list.length === 0 ? (
        <p className="card p-6 text-center text-muted">{GLOSSARY.length === 0 ? "واژه‌نامه به‌زودی پر می‌شود." : "واژه‌ای پیدا نشد. یک کلمه‌ی دیگر را امتحان کن."}</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {list.map((g) => (
            <li key={g.id} className="card p-4">
              <h2 className="text-lg">{g.term} {g.latin && <Ltr className="text-sm text-muted">({g.latin})</Ltr>}</h2>
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand-ink">{CATS[g.category]}</span>
              <p className="mt-2">{g.definition}</p>
              <p className="mt-1 text-sm">
                {g.topicIds.filter((t) => TOPICS[t]).map((t) => (
                  <Link key={t} href={`/topic/${t}`} className="me-3 underline">{TOPICS[t].title}</Link>
                ))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
