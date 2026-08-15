"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const MAX_TEXT = 500;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

async function assertOwnsHabit(userId: string, habitId: string) {
  const habit = await prisma.habit.findUnique({ where: { id: habitId }, select: { userId: true } });
  if (!habit || habit.userId !== userId) {
    throw new Error("No autorizado");
  }
}

const CreateHabitSchema = z.object({
  name: z.string().trim().min(1, "Ingresá un nombre.").max(120),
  frequency: z.enum(["daily", "weekly"]),
});

export async function createHabit(input: { name: string; frequency: "daily" | "weekly" }) {
  const { userId } = await verifySession();
  const parsed = CreateHabitSchema.parse(input);
  await prisma.habit.create({ data: { userId, name: parsed.name, frequency: parsed.frequency } });
  revalidatePath("/habits");
  revalidatePath("/");
}

export async function deleteHabit(habitId: string) {
  const { userId } = await verifySession();
  await assertOwnsHabit(userId, habitId);
  await prisma.habit.delete({ where: { id: habitId } });
  revalidatePath("/habits");
  revalidatePath("/");
}

const EvidenceSchema = z.object({
  habitId: z.string().min(1),
  date: z.string().regex(ISO_DATE, "Fecha inválida."),
  text: z.string().max(MAX_TEXT).default(""),
  photoDataUrl: z.string().nullable().default(null),
});

export async function saveHabitEvidence(input: {
  habitId: string;
  date: string;
  text: string;
  photoDataUrl: string | null;
}) {
  const { userId } = await verifySession();
  const parsed = EvidenceSchema.parse(input);
  if (!parsed.text.trim() && !parsed.photoDataUrl) {
    throw new Error("Se necesita texto o foto como evidencia.");
  }
  await assertOwnsHabit(userId, parsed.habitId);

  const date = new Date(`${parsed.date}T00:00:00.000Z`);
  await prisma.habitCompletion.upsert({
    where: { habitId_date: { habitId: parsed.habitId, date } },
    create: {
      habitId: parsed.habitId,
      userId,
      date,
      text: parsed.text.trim(),
      photoDataUrl: parsed.photoDataUrl,
    },
    update: { text: parsed.text.trim(), photoDataUrl: parsed.photoDataUrl },
  });
  revalidatePath("/habits");
  revalidatePath("/");
}

export async function deleteHabitEvidence(habitId: string, isoDate: string) {
  const { userId } = await verifySession();
  if (!ISO_DATE.test(isoDate)) throw new Error("Fecha inválida.");
  await assertOwnsHabit(userId, habitId);
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  await prisma.habitCompletion.deleteMany({ where: { habitId, date } });
  revalidatePath("/habits");
  revalidatePath("/");
}
