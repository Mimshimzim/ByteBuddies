"use client";
import Link from "next/link";
import { LABS } from "@/components/labs";
import type { LabId } from "@/lib/types";
import { LabHost } from "./LabHost";
import { useProgress } from "./ProgressProvider";
import { Loading, Notice } from "./ui";

export function LabPage({ labId }: { labId: string }) {
  const { ready } = useProgress();
  const lab = (LABS as Record<string, { title: string } | undefined>)[labId];
  if (!lab) {
    return (
      <Notice title="این تمرین پیدا نشد" action={{ href: "/map", label: "بازگشت به نقشه" }}>
        شاید هنوز ساخته نشده یا نشانی اشتباه است.
      </Notice>
    );
  }
  if (!ready) return <Loading />;
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="مسیر" className="mb-3 text-sm text-muted"><Link href="/map" className="underline">نقشه یادگیری</Link> / تمرین</nav>
      <h1 className="mb-1 text-3xl">🧪 {lab.title}</h1>
      <p className="mb-4 text-muted">اینجا می‌توانی هر چقدر دلت می‌خواهد تمرین کنی. همه چیز شبیه‌سازی است و هیچ چیز روی دستگاه تو تغییر نمی‌کند.</p>
      <LabHost labId={labId as LabId} />
    </div>
  );
}
