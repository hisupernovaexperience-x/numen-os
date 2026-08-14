import { EmptyState, PageHeader } from "@/components/ui";
import { CalendarIcon } from "@/components/icons";

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="Calendario" description="Vista de tus eventos y fechas importantes." />
      <EmptyState icon={<CalendarIcon className="size-8" />} title="Módulo en construcción" hint="Acá vas a poder ver y cargar eventos. Todavía no tiene funcionalidad." />
    </div>
  );
}
