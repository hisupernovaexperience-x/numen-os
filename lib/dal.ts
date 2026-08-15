import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isMockMode } from "@/lib/mock-mode";
import { DEMO_USER_ID } from "@/lib/mock-store";

/**
 * Verificación real de sesión — la usan las Server Actions y Server Components que
 * leen o escriben datos. Toda query a la base de datos debe pasar por acá y filtrar
 * explícitamente por el userId devuelto, nunca confiar solo en el proxy.
 *
 * En modo demo (sin DATABASE_URL) devuelve siempre el mismo userId fijo, sin tocar
 * Auth.js — no hay sesiones reales que verificar.
 */
export const verifySession = cache(async () => {
  if (isMockMode) return { userId: DEMO_USER_ID };

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return { userId: session.user.id };
});
