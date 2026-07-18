import { TemplateInstancesPage } from "@/features/forms";

export default function Page({ params }: { params: Promise<{ id: string, templateId: string }> }) {
  return <TemplateInstancesPage params={params} />;
}
