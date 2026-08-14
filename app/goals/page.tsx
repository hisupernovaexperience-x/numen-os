"use client";

import { useLocalStorage } from "@/lib/storage";
import { buildNatalCard } from "@/lib/astro";
import type { UserProfile } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function GoalsPage() {
  const [profile] = useLocalStorage<UserProfile | null>("numen:profile", null);
  const integration = profile ? buildNatalCard(profile).integration : null;

  return (
    <div>
      <PageHeader
        title="Goals anuales"
        description="Objetivos desglosados por mes, personalizados según lo que venís a integrar — no por áreas de vida genéricas."
      />

      {integration && (
        <Card className="mb-6">
          <p className="text-sm">
            Este año venís trabajando principalmente: <span className="font-medium text-accent">{integration}</span>.
            Los goals de cada mes se van a sugerir en base a esto.
          </p>
        </Card>
      )}

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
