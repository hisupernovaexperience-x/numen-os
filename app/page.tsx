import Link from "next/link";
import { requireProfile } from "@/lib/onboarding";
import { prisma } from "@/lib/prisma";
import { isMockMode } from "@/lib/mock-mode";
import { mockDB } from "@/lib/mock-store";
import { buildNatalCard } from "@/lib/astro";
import { calcStreak, todayISO } from "@/lib/date";
import { Badge, Card } from "@/components/ui";
import { CompassIcon, MoonIcon, PulseIcon, SparkleIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

async function getDashboardStats(userId: string) {
  const today = todayISO();

  if (isMockMode) {
    const habits = mockDB.habits;
    return {
      dreamCount: mockDB.dreams.length,
      habitsCount: habits.length,
      doneToday: habits.filter((h) => h.completions.some((c) => c.date === today)).length,
      bestStreak: habits.reduce((max, h) => Math.max(max, calcStreak(h.completions.map((c) => c.date))), 0),
    };
  }

  const [dreamCount, habits] = await Promise.all([
    prisma.dream.count({ where: { userId } }),
    prisma.habit.findMany({
      where: { userId, archived: false },
      include: { completions: { select: { date: true } } },
    }),
  ]);

  return {
    dreamCount,
    habitsCount: habits.length,
    doneToday: habits.filter((h) => h.completions.some((c) => c.date.toISOString().slice(0, 10) === today)).length,
    bestStreak: habits.reduce(
      (max, h) => Math.max(max, calcStreak(h.completions.map((c) => c.date.toISOString().slice(0, 10)))),
      0,
    ),
  };
}

export default async function Dashboard() {
  const { userId, profile } = await requireProfile();
  const { dreamCount, habitsCount, doneToday, bestStreak } = await getDashboardStats(userId);

  const card = buildNatalCard({
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
  });

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
              {doneToday}/{habitsCount}
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
            <p className="text-2xl font-semibold">{dreamCount}</p>
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
