"use client";
import Link from "next/link";
import { EXAMS, QUESTIONS, TOPICS, topicExamId } from "@/content";
import { isTopicUnlocked } from "@/lib/unlock";
import { useProgress } from "@/components/ProgressProvider";
import { Loading, Notice, PageTitle, fa } from "@/components/ui";

export default function ReviewPage() {
  const { progress, ready } = useProgress();
  if (!ready) return <Loading />;
  const weak = Object.entries(progress.weakConcepts).sort((a, b) => b[1] - a[1]);
  if (weak.length === 0) {
    return (
      <Notice title="چیزی برای مرور نیست 🎉" mood="cheer" action={{ href: "/map", label: "ادامه‌ی یادگیری" }}>
        هر وقت در آزمونی به مفهومی نیاز به تمرین داشتی، اینجا نشان داده می‌شود. این مرکز فقط برای کمک است، نه نمره دادن.
      </Notice>
    );
  }
  return (
    <div>
      <PageTitle title="مرکز مرور" subtitle="این مفهوم‌ها کمی تمرین بیشتر می‌خواهند. درسشان را بخوان و دوباره آزمون بده." />
      <ul className="space-y-3">
        {weak.map(([concept, n]) => {
          const topicIds = [...new Set(Object.values(QUESTIONS).filter((q) => q.concept === concept).map((q) => q.topicId))].filter((t) => TOPICS[t]);
          return (
            <li key={concept} className="card p-4">
              <h2 className="text-lg">{concept}</h2>
              <p className="text-sm text-muted">{fa(n)} بار نیاز به مرور داشته</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {topicIds.map((t) => (
                  <span key={t} className="contents">
                    <Link href={`/topic/${t}`} className="btn btn-ghost">مرور: {TOPICS[t].title}</Link>
                    {EXAMS[topicExamId(t)] && isTopicUnlocked(progress, t) && <Link href={`/exam/${topicExamId(t)}`} className="btn btn-sun">تمرین با آزمون</Link>}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
