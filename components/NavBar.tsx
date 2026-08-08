"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/dreams", label: "Sueños", icon: "🌙" },
  { href: "/habits", label: "Hábitos", icon: "✅" },
  { href: "/goals", label: "Objetivos", icon: "🎯" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar de escritorio */}
      <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-black/10 dark:md:border-white/10 md:py-6 md:px-3 md:shrink-0">
        <div className="px-3 pb-6 text-lg font-semibold tracking-tight">
          Numen
        </div>
        <nav className="flex flex-col gap-1">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-black/10 dark:bg-white/15 text-foreground"
                    : "text-foreground/60 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                }`}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Tabs de mobile */}
      <nav className="fixed bottom-0 inset-x-0 z-20 flex md:hidden border-t border-black/10 dark:border-white/10 bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        {LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
                active ? "text-foreground" : "text-foreground/50"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
