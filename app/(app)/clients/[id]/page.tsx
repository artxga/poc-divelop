import { ClientDetailPage } from "@/features/clients";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ClientDetailPage params={params} />;
}
