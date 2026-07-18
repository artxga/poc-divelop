import { FormBuilderPage } from "@/features/forms";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <FormBuilderPage params={params} />;
}
