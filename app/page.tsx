"use client";

import Link from "next/link";
import { useLocalStorage } from "@/lib/storage";
import { calcStreak, formatDate, todayISO } from "@/lib/date";
import type { Dream, Goal, Habit } from "@/lib/types";
import { Card } from "@/components/ui";

function progress(goal: Goal): number {
  if (goal.milestones.length === 0) return goal.status === "completed" ? 100 : 0;
  const done = goal.milestones.filter((m) => m.done).length;
  return Math.round((done / goal.milestones.length) * 100);
}

export default function Dashboard() {
  const [dreams] = useLocalStorage<Dream[]>("numen:dreams", []);
  const [habits] = useLocalStorage<Habit[]>("numen:habits", []);
  const [goals] = useLocalStorage<Goal[]>("numen:goals", []);

  const today = todayISO();
  const activeHabits = habits.filter((h) => !h.archived);
  const doneToday = activeHabits.filter((h) => h.completions.includes(today)).length;
  const activeGoals = goals.filter((g) => g.status === "active");
  const lastDream = [...dreams].sort((a, b) => b.date.localeCompare(a.date))[0];
  const bestStreak = activeHabits.reduce((max, h) => Math.max(max, calcStreak(h.completions)), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Hola 👋</h1>
        <p className="text-sm text-foreground/60 mt-1">Tu resumen de hoy.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dreams">
          <Card className="h-full hover:border-foreground/30 transition-colors">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">🌙 Sueños</p>
            <p className="text-2xl font-semibold mt-2">{dreams.length}</p>
            <p className="text-xs text-foreground/60 mt-1">
              {lastDream ? `Último: ${formatDate(lastDream.date)}` : "Sin registros todavía"}
            </p>
          </Card>
        </Link>

        <Link href="/habits">
          <Card className="h-full hover:border-foreground/30 transition-colors">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">✅ Hábitos</p>
            <p className="text-2xl font-semibold mt-2">
              {doneToday}/{activeHabits.length}
            </p>
            <p className="text-xs text-foreground/60 mt-1">
              {bestStreak > 0 ? `Mejor racha: 🔥 ${bestStreak} días` : "Hechos hoy"}
            </p>
          </Card>
        </Link>

        <Link href="/goals">
          <Card className="h-full hover:border-foreground/30 transition-colors">
            <p className="text-xs font-medium text-foreground/50 uppercase tracking-wide">🎯 Objetivos</p>
            <p className="text-2xl font-semibold mt-2">{activeGoals.length}</p>
            <p className="text-xs text-foreground/60 mt-1">activos</p>
          </Card>
        </Link>
      </div>

      {activeGoals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-foreground/70 mb-3">Progreso de objetivos</h2>
          <div className="grid gap-3">
            {activeGoals.slice(0, 4).map((goal) => {
              const pct = progress(goal);
              return (
                <Card key={goal.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium truncate">{goal.title}</p>
                    <span className="text-xs tabular-nums text-foreground/60">{pct}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {dreams.length === 0 && habits.length === 0 && goals.length === 0 && (
        <Card className="mt-8 text-center py-10">
          <p className="text-sm text-foreground/70">
            Todavía no cargaste nada. Elegí un módulo para empezar a trackear tus sueños, hábitos u objetivos.
          </p>
        </Card>
      )}
    </div>
  );
}
