import "server-only";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

/** Requiere sesión + perfil ya cargado (onboarding completo). Si falta el perfil, redirige. */
export async function requireProfile() {
  const { userId } = await verifySession();
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect("/onboarding");
  return { userId, profile };
}
