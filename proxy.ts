import { NextResponse } from "next/server";
import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/login", "/signup"];

/**
 * Chequeo optimista basado en la cookie de sesión (JWT, sin ir a la base de datos).
 * La verificación real y el scoping por usuario se hacen en la Data Access Layer
 * (lib/dal.ts) en cada Server Action / Server Component, que sí es la línea de
 * defensa real — este proxy solo evita que un usuario no autenticado llegue a
 * renderizar la UI de la app.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
  const isLoggedIn = !!req.auth?.user;

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
