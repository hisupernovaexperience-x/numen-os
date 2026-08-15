import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import HabitsBoard, { type HabitView } from "@/components/habits/HabitsBoard";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const { userId } = await verifySession();

  const habits = await prisma.habit.findMany({
    where: { userId, archived: false },
    orderBy: { createdAt: "desc" },
    include: { completions: true },
  });

  const habitViews: HabitView[] = habits.map((h) => ({
    id: h.id,
    name: h.name,
    frequency: h.frequency === "weekly" ? "weekly" : "daily",
    completions: h.completions.map((c) => ({
      date: c.date.toISOString().slice(0, 10),
      text: c.text,
      photoDataUrl: c.photoDataUrl,
    })),
  }));

  return <HabitsBoard habits={habitViews} />;
}
