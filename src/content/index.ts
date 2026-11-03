/** Content registry — owned by the lead. Learning engineer owns the session modules it imports. */
import type { Achievement, Exam, GlossaryTerm, Question, Session, SessionContent, Topic } from "@/lib/types";
import s1 from "./session1";

const MODULES: SessionContent[] = [s1];

export const SESSIONS: Session[] = MODULES.map((m) => m.session).sort((a, b) => a.order - b.order);
export const TOPICS: Record<string, Topic> = Object.fromEntries(MODULES.flatMap((m) => m.topics).map((t) => [t.id, t]));
export const QUESTIONS: Record<string, Question> = Object.fromEntries(MODULES.flatMap((m) => m.questions).map((q) => [q.id, q]));
export const EXAMS: Record<string, Exam> = Object.fromEntries(MODULES.flatMap((m) => m.exams).map((e) => [e.id, e]));
export const GLOSSARY: GlossaryTerm[] = MODULES.flatMap((m) => m.glossary);
export const ACHIEVEMENTS: Achievement[] = MODULES.flatMap((m) => m.achievements);

export const topicExamId = (topicId: string) => `exam-${topicId}`;
