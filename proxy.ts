import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMockMode } from "@/lib/mock-mode";

/**
 * Chequeo optimista basado en la cookie de sesión (JWT, sin ir a la base de datos).
 * La verificación real y el scoping por usuario se hacen en la Data Access Layer
 * (lib/dal.ts) en cada Server Action / Server Component, que sí es la línea de
 * defensa real — este proxy solo evita que un usuario no autenticado llegue a
 * renderizar la UI de la app.
 *
 * En modo demo (sin DATABASE_URL) no hay sesiones reales ni AUTH_SECRET
 * configurado: ni siquiera importamos Auth.js, dejamos pasar todo.
 */
export default async function proxy(req: NextRequest) {
  if (isMockMode) return NextResponse.next();

  const { authProxy } = await import("@/lib/auth-proxy");
  return authProxy(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
