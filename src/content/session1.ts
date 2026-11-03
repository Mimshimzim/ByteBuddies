import type { Exam, SessionContent } from "@/lib/types";
import { achievements } from "./session1/achievements";
import { checkpointQuestions } from "./session1/checkpoint";
import { glossary } from "./session1/glossary";
import * as t1 from "./session1/t1";
import * as t2 from "./session1/t2";
import * as t3 from "./session1/t3";
import * as t4 from "./session1/t4";
import * as t5 from "./session1/t5";
import * as t6 from "./session1/t6";
import * as t7 from "./session1/t7";

const parts = [t1, t2, t3, t4, t5, t6, t7];
const topics = parts.map((p) => p.topic);
const questions = [...parts.flatMap((p) => p.questions), ...checkpointQuestions];

const topicExams: Exam[] = parts.map((p) => ({
  id: `exam-${p.topic.id}`,
  kind: "topic",
  title: `آزمون: ${p.topic.title}`,
  sessionId: "s1",
  topicId: p.topic.id,
  questionIds: p.questions.map((q) => q.id),
  draw: 6,
  passPercent: 80,
}));

const checkpoint: Exam = {
  id: "checkpoint-s1",
  kind: "checkpoint",
  title: "آزمون مرحله‌ای جلسه ۱: آشنایی با رایانه",
  sessionId: "s1",
  questionIds: checkpointQuestions.map((q) => q.id),
  draw: 12,
  passPercent: 80,
};

const content: SessionContent = {
  session: {
    id: "s1",
    order: 1,
    title: "جلسه ۱: آشنایی با رایانه",
    tagline: "رایانه چیست، درونش چه خبر است و چطور با ویندوز و ایمیل دوست شویم.",
    icon: "💻",
    color: "sun",
    topicIds: topics.map((t) => t.id),
    checkpointExamId: "checkpoint-s1",
    badgeId: "badge-s1",
  },
  topics,
  questions,
  exams: [...topicExams, checkpoint],
  glossary,
  achievements,
};

export default content;
