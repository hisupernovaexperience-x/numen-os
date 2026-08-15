/**
 * Modo demo: cuando no hay DATABASE_URL configurada, la app corre entera sobre
 * datos en memoria (lib/mock-store.ts) en vez de Postgres, y sin pasar por
 * Auth.js — pensado para diseñar y mostrar los flujos de UI sin depender de
 * infraestructura real. Apenas se configura DATABASE_URL, este flag pasa a
 * false y la app usa el camino real (Prisma + Auth.js) sin tocar código.
 */
export const isMockMode = !process.env.DATABASE_URL;
