import { LessonPlayer } from "@/components/LessonPlayer";

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  return <LessonPlayer topicId={topicId} />;
}
