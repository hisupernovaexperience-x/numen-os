import "server-only";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/mock-mode";
import { mockDB } from "@/lib/mock-store";

export interface ProfileView {
  name: string;
  sex: string;
  birthDate: string; // ISO yyyy-mm-dd
  birthTime: string | null;
  country: string;
  city: string;
  locality: string | null;
}

/** Requiere sesión + perfil ya cargado (onboarding completo). Si falta el perfil, redirige. */
export async function requireProfile(): Promise<{ userId: string; profile: ProfileView }> {
  const { userId } = await verifySession();

  if (isMockMode) {
    if (!mockDB.profile) redirect("/onboarding");
    return { userId, profile: mockDB.profile };
  }

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect("/onboarding");

  return {
    userId,
    profile: {
      name: profile.name,
      sex: profile.sex,
      birthDate: profile.birthDate.toISOString().slice(0, 10),
      birthTime: profile.birthTime,
      country: profile.country,
      city: profile.city,
      locality: profile.locality,
    },
  };
}
