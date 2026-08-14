"use client";

import Link from "next/link";
import { useLocalStorage } from "@/lib/storage";
import { calcStreak, todayISO } from "@/lib/date";
import { buildNatalCard } from "@/lib/astro";
import type { Dream, Habit, UserProfile } from "@/lib/types";
import { Badge, Card } from "@/components/ui";
import { CompassIcon, MoonIcon, PulseIcon, SparkleIcon } from "@/components/icons";

export default function Dashboard() {
  const [profile] = useLocalStorage<UserProfile | null>("numen:profile", null);
  const [dreams] = useLocalStorage<Dream[]>("numen:dreams", []);
  const [habits] = useLocalStorage<Habit[]>("numen:habits", []);

  if (!profile) return null;

  const card = buildNatalCard(profile);
  const today = todayISO();
  const activeHabits = habits.filter((h) => !h.archived);
  const doneToday = activeHabits.filter((h) => today in h.completions).length;
  const bestStreak = activeHabits.reduce((max, h) => Math.max(max, calcStreak(Object.keys(h.completions))), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Hola, {profile.name.split(" ")[0]}</h1>
        <p className="text-sm text-muted mt-1">Tu partida de hoy.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <SparkleIcon className="size-4 text-accent" />
            <h2 className="text-sm font-semibold">Tu carta</h2>
          </div>
          <div className="grid gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Signo</span>
              <span className="font-medium">
                {card.sign.symbol} {card.sign.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Diseño humano</span>
              <span className="font-medium">{card.humanDesignType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Kin maya</span>
              <span className="font-medium">
                {card.mayanKin.tone} {card.mayanKin.sign}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted">
              Estimación preliminar (diseño humano y kin maya) mientras se define el motor de cálculo definitivo.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Venís a integrar</h2>
            <Badge tone="accent">{card.integration}</Badge>
          </div>
          <ul className="grid gap-2.5">
            {card.missions.map((mission) => (
              <li key={mission.id} className="text-sm">
                <p className="font-medium">{mission.title}</p>
                <p className="text-muted text-xs mt-0.5">{mission.description}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <Link href="/habits">
          <Card className="h-full hover:border-accent/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <PulseIcon className="size-4 text-muted" />
              <p className="text-xs font-medium text-muted uppercase tracking-wide">Hábitos</p>
            </div>
            <p className="text-2xl font-semibold">
              {doneToday}/{activeHabits.length}
            </p>
            <p className="text-xs text-muted mt-1">{bestStreak > 0 ? `Mejor racha: ${bestStreak} días` : "hechos hoy"}</p>
          </Card>
        </Link>

        <Link href="/dreams">
          <Card className="h-full hover:border-accent/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <MoonIcon className="size-4 text-muted" />
              <p className="text-xs font-medium text-muted uppercase tracking-wide">Sueños</p>
            </div>
            <p className="text-2xl font-semibold">{dreams.length}</p>
            <p className="text-xs text-muted mt-1">registrados</p>
          </Card>
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-muted">
        <CompassIcon className="size-4" />
        Notas, Tareas, Calendario, Moodboard, Goals anuales y Estrategias 90 días — próximamente en el menú.
      </div>
    </div>
  );
}
