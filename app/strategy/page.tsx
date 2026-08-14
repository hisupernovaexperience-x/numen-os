import { EmptyState, PageHeader } from "@/components/ui";
import { CompassIcon } from "@/components/icons";

export default function StrategyPage() {
  return (
    <div>
      <PageHeader title="Estrategias 90 días" description="Planificación táctica por trimestre." />
      <EmptyState icon={<CompassIcon className="size-8" />} title="Módulo en construcción" hint="Acá vas a poder definir y trackear un plan de 90 días. Todavía no tiene funcionalidad." />
    </div>
  );
}
