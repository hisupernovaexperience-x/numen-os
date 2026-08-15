import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import { isMockMode } from "@/lib/mock-mode";
import "./globals.css";

export const metadata: Metadata = {
  title: "Numen — Dashboard personal",
  description: "Notas, tareas, calendario, sueños, hábitos, moodboard y goals en un solo lugar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111113",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col md:flex-row bg-background text-foreground">
        {isMockMode && (
          <div className="fixed bottom-0 inset-x-0 z-50 md:left-60 bg-amber-500 text-amber-950 text-xs font-medium text-center py-1.5 px-3">
            Modo demo — datos en memoria, sin base de datos ni login real. Se pierden al reiniciar el servidor.
          </div>
        )}
        <NavBar />
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 pb-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
