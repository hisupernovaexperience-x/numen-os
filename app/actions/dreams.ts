"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const CreateDreamSchema = z.object({
  title: z.string().trim().min(1, "Ingresá un título.").max(200),
  description: z.string().trim().max(5000).default(""),
  date: z.string().regex(ISO_DATE, "Fecha inválida."),
  lucid: z.boolean().default(false),
  mood: z.enum(["great", "good", "neutral", "bad", "nightmare"]),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export async function createDream(input: {
  title: string;
  description: string;
  date: string;
  lucid: boolean;
  mood: "great" | "good" | "neutral" | "bad" | "nightmare";
  tags: string[];
}) {
  const { userId } = await verifySession();
  const parsed = CreateDreamSchema.parse(input);
  await prisma.dream.create({
    data: {
      userId,
      title: parsed.title,
      description: parsed.description,
      date: new Date(`${parsed.date}T00:00:00.000Z`),
      lucid: parsed.lucid,
      mood: parsed.mood,
      tags: parsed.tags,
    },
  });
  revalidatePath("/dreams");
  revalidatePath("/");
}

export async function deleteDream(dreamId: string) {
  const { userId } = await verifySession();
  const dream = await prisma.dream.findUnique({ where: { id: dreamId }, select: { userId: true } });
  if (!dream || dream.userId !== userId) {
    throw new Error("No autorizado");
  }
  await prisma.dream.delete({ where: { id: dreamId } });
  revalidatePath("/dreams");
  revalidatePath("/");
}
