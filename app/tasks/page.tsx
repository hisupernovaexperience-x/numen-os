import { EmptyState, PageHeader } from "@/components/ui";
import { TaskIcon } from "@/components/icons";

export default function TasksPage() {
  return (
    <div>
      <PageHeader title="Tareas" description="Tu lista de pendientes del día a día." />
      <EmptyState icon={<TaskIcon className="size-8" />} title="Módulo en construcción" hint="Acá vas a poder crear y tildar tareas. Todavía no tiene funcionalidad." />
    </div>
  );
}
