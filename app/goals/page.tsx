import { EmptyState, PageHeader } from "@/components/ui";

export default function GoalsPage() {
  return (
    <div>
      <PageHeader title="Goals" description="Definí metas y dividilas en pasos concretos." />
      <EmptyState
        icon="🎯"
        title="Todavía no hay goals"
        hint="Esta sección está lista para empezar a definir tus objetivos."
      />
    </div>
  );
}
