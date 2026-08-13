import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Numen — Dashboard personal",
  description: "Sueño, hábitos, moodboard, goals y estrategia 90 días en un solo lugar.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`h-full antialiased ${manrope.variable}`}>
      <body className="min-h-full bg-background text-foreground">
        <Sidebar />
        <main className="min-h-screen px-4 py-6 pb-24 md:pl-64 md:px-10 md:py-10 md:pb-10">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
      </body>
    </html>
  );
}
