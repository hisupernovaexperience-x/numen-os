import type { Metadata, Viewport } from "next";
import NavBar from "@/components/NavBar";
import OnboardingGate from "@/components/OnboardingGate";
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
        <NavBar />
        <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-3xl">
            <OnboardingGate>{children}</OnboardingGate>
          </div>
        </main>
      </body>
    </html>
  );
}
