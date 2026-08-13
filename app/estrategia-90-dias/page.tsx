import { EmptyState, PageHeader } from "@/components/ui";

export default function Estrategia90DiasPage() {
  return (
    <div>
      <PageHeader title="Estrategia 90 días" description="Planificá tu próximo trimestre en grandes líneas." />
      <EmptyState
        icon="🧭"
        title="Todavía no hay una estrategia cargada"
        hint="Esta sección está lista para empezar a planificar tus próximos 90 días."
      />
    </div>
  );
}
