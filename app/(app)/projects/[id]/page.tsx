import { ProjectDetailPage } from "@/features/projects";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ProjectDetailPage params={params} />;
}
