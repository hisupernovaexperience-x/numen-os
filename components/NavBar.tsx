"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import {
  CalendarIcon,
  CloseIcon,
  CompassIcon,
  HomeIcon,
  ImageIcon,
  MenuIcon,
  MoonIcon,
  NoteIcon,
  PulseIcon,
  TargetIcon,
  TaskIcon,
} from "@/components/icons";

const LINKS = [
  { href: "/", label: "Inicio", icon: HomeIcon },
  { href: "/notes", label: "Notas", icon: NoteIcon },
  { href: "/tasks", label: "Tareas", icon: TaskIcon },
  { href: "/calendar", label: "Calendario", icon: CalendarIcon },
  { href: "/dreams", label: "Sueños", icon: MoonIcon },
  { href: "/habits", label: "Hábitos", icon: PulseIcon },
  { href: "/moodboard", label: "Moodboard", icon: ImageIcon },
  { href: "/goals", label: "Goals anuales", icon: TargetIcon },
  { href: "/strategy", label: "Estrategias 90 días", icon: CompassIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.map((link) => {
        const active = isActive(pathname, link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-accent-soft text-accent" : "text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
            }`}
          >
            <Icon className="size-[18px] shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  if (pathname === "/onboarding" || pathname === "/login" || pathname === "/signup") return null;

  return (
    <>
      {/* Sidebar fijo de escritorio */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:py-6 md:px-3 md:shrink-0">
        <div className="px-3 pb-6 text-lg font-semibold tracking-tight">Numen</div>
        <SidebarLinks pathname={pathname} />
        <form action={logout} className="mt-auto pt-3">
          <button type="submit" className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground">
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* Topbar de mobile */}
      <header className="flex md:hidden items-center justify-between border-b border-border px-4 py-3 sticky top-0 z-30 bg-background/95 backdrop-blur">
        <span className="text-lg font-semibold tracking-tight">Numen</span>
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="p-1.5 rounded-lg text-foreground hover:bg-black/5 dark:hover:bg-white/10"
        >
          <MenuIcon className="size-6" />
        </button>
      </header>

      {/* Drawer de mobile */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-background border-r border-border p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold tracking-tight">Numen</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="p-1 text-muted hover:text-foreground">
                <CloseIcon className="size-5" />
              </button>
            </div>
            <SidebarLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            <form action={logout} className="mt-auto pt-3">
              <button type="submit" className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
