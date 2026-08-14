import { EmptyState, PageHeader } from "@/components/ui";

export default function HabitosPage() {
  return (
    <div>
      <PageHeader title="Hábitos" description="Marcá tu progreso día a día y sostené la racha." />
      <EmptyState
        icon="✅"
        title="Todavía no hay hábitos"
        hint="Esta sección está lista para empezar a trackear tus hábitos."
      />
    </div>
  );
}
