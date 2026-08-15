"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import type { FormState } from "@/app/actions/auth";

const ProfileSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  sex: z.enum(["femenino", "masculino", "otro", "prefiero_no_decir"]),
  birthDate: z.iso.date("Ingresá una fecha válida."),
  birthTime: z.string().trim().optional(),
  country: z.string().trim().min(1, "Ingresá un país."),
  city: z.string().trim().min(1, "Ingresá una ciudad."),
  locality: z.string().trim().optional(),
});

export async function saveProfile(_prevState: FormState, formData: FormData): Promise<FormState> {
  const { userId } = await verifySession();

  const parsed = ProfileSchema.safeParse({
    name: formData.get("name"),
    sex: formData.get("sex"),
    birthDate: formData.get("birthDate"),
    birthTime: formData.get("birthTime") || undefined,
    country: formData.get("country"),
    city: formData.get("city"),
    locality: formData.get("locality") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { name, sex, birthDate, birthTime, country, city, locality } = parsed.data;

  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (existing) {
    return { error: "Ya configuraste tu partida." };
  }

  await prisma.profile.create({
    data: {
      userId,
      name,
      sex,
      birthDate: new Date(`${birthDate}T00:00:00.000Z`),
      birthTime: birthTime || null,
      country,
      city,
      locality: locality || null,
    },
  });

  redirect("/");
}
