import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Verificación real de sesión — la usan las Server Actions y Server Components que
 * leen o escriben datos. Toda query a la base de datos debe pasar por acá y filtrar
 * explícitamente por el userId devuelto, nunca confiar solo en el proxy.
 */
export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return { userId: session.user.id };
});
