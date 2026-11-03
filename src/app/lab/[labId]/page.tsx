import { LabPage } from "@/components/LabPage";

export default async function Page({ params }: { params: Promise<{ labId: string }> }) {
  const { labId } = await params;
  return <LabPage labId={labId} />;
}
