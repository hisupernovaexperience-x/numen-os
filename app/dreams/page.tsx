import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import DreamsBoard, { type DreamView } from "@/components/dreams/DreamsBoard";

export const dynamic = "force-dynamic";

export default async function DreamsPage() {
  const { userId } = await verifySession();

  const dreams = await prisma.dream.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  const dreamViews: DreamView[] = dreams.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    date: d.date.toISOString().slice(0, 10),
    tags: d.tags,
    lucid: d.lucid,
    mood: d.mood as DreamView["mood"],
  }));

  return <DreamsBoard dreams={dreamViews} />;
}
