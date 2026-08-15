import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/mock-mode";
import { mockDB } from "@/lib/mock-store";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await verifySession();

  const alreadyOnboarded = isMockMode ? !!mockDB.profile : !!(await prisma.profile.findUnique({ where: { userId } }));
  if (alreadyOnboarded) redirect("/");

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Configurá tu partida</h1>
          <p className="text-sm text-muted mt-1">
            Con tus datos de nacimiento armamos tu carta y te sugerimos qué venís a integrar en esta vida.
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
