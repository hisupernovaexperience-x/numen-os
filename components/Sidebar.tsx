"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/sueno", label: "Sueño", icon: "🌙" },
  { href: "/habitos", label: "Hábitos", icon: "✅" },
  { href: "/moodboard", label: "Moodboard", icon: "🎨" },
  { href: "/goals", label: "Goals", icon: "🎯" },
  { href: "/estrategia-90-dias", label: "Estrategia 90 días", icon: "🧭" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar fijo de escritorio */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-surface md:px-4 md:py-6">
        <div className="px-2 pb-8 text-lg font-semibold tracking-tight text-foreground">
          Numen
        </div>
        <nav className="flex flex-col gap-1">
          {SECTIONS.map((section) => {
            const active = isActive(pathname, section.href);
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent/10 text-accent" : "text-muted hover:bg-background hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{section.icon}</span>
                {section.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Tabs de mobile */}
      <nav className="fixed bottom-0 inset-x-0 z-20 flex md:hidden border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        {SECTIONS.map((section) => {
          const active = isActive(pathname, section.href);
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-center text-[11px] font-medium leading-tight ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {section.icon}
              </span>
              {section.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
