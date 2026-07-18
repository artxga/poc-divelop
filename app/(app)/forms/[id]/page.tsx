import { FormDetailPage } from "@/features/forms";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FormDetailPage params={params} />;
}
