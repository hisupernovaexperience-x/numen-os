import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/login", "/signup"];

/**
 * Solo se importa (y por lo tanto solo evalúa auth.ts / exige AUTH_SECRET) cuando
 * proxy.ts decide que NO estamos en modo demo. Mantenido en su propio módulo para
 * que el import dinámico en proxy.ts nunca cargue Auth.js en modo demo.
 *
 * El cast final es necesario porque `auth(...)` está tipado con overloads que
 * TypeScript no logra desambiguar fuera del `export default` de un archivo
 * proxy.ts (ahí Next.js aporta el tipo esperado por contexto); acá lo forzamos
 * explícitamente a la forma de middleware (un solo NextRequest).
 */
export const authProxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
  const isLoggedIn = !!req.auth?.user;

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
}) as unknown as (req: NextRequest) => Promise<Response> | Response;
