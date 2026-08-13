import { EmptyState, PageHeader } from "@/components/ui";

export default function SuenoPage() {
  return (
    <div>
      <PageHeader title="Sueño" description="Registrá tus sueños apenas te despiertes." />
      <EmptyState
        icon="🌙"
        title="Todavía no hay sueños registrados"
        hint="Esta sección está lista para empezar a cargar tus sueños."
      />
    </div>
  );
}
