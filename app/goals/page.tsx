import { requireProfile } from "@/lib/onboarding";
import { buildNatalCard } from "@/lib/astro";
import { Card, PageHeader } from "@/components/ui";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const { profile } = await requireProfile();
  const integration = buildNatalCard({
    birthDate: profile.birthDate.toISOString().slice(0, 10),
    birthTime: profile.birthTime,
  }).integration;

  return (
    <div>
      <PageHeader
        title="Goals anuales"
        description="Objetivos desglosados por mes, personalizados según lo que venís a integrar — no por áreas de vida genéricas."
      />

      <Card className="mb-6">
        <p className="text-sm">
          Este año venís trabajando principalmente: <span className="font-medium text-accent">{integration}</span>.
          Los goals de cada mes se van a sugerir en base a esto.
        </p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {MONTHS.map((month) => (
          <Card key={month}>
            <p className="text-sm font-medium">{month}</p>
            <p className="text-xs text-muted mt-1">Sin objetivos definidos todavía.</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
