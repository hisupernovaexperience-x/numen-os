"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isMockMode } from "@/lib/mock-mode";

export type FormState = { error?: string } | undefined;

const SignupSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.email("Ingresá un email válido.").trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[a-zA-Z]/, "La contraseña debe contener al menos una letra.")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número.")
    .regex(/[^a-zA-Z0-9]/, "La contraseña debe contener al menos un carácter especial."),
});

export async function signup(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const { name, email, password } = parsed.data;

  if (isMockMode) {
    redirect("/onboarding");
  }

  const limited = consumeRateLimit(`signup:${email.toLowerCase()}`, 5, 15 * 60 * 1000);
  if (!limited.allowed) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese email. Iniciá sesión." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/onboarding" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "La cuenta se creó pero no pudimos iniciar sesión. Probá desde /login." };
    }
    throw error;
  }
}

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function login(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Ingresá un email y contraseña válidos." };
  }

  if (isMockMode) {
    redirect("/");
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos." };
    }
    throw error;
  }
}

export async function signInWithGoogle() {
  if (isMockMode) {
    redirect("/");
  }
  await signIn("google", { redirectTo: "/" });
}

const MagicLinkSchema = z.object({ email: z.email() });

export async function signInWithMagicLink(_prevState: FormState, formData: FormData): Promise<FormState> {
  const parsed = MagicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Ingresá un email válido." };
  }

  if (isMockMode) {
    redirect("/");
  }

  const limited = consumeRateLimit(`magiclink:${parsed.data.email.toLowerCase()}`, 5, 15 * 60 * 1000);
  if (!limited.allowed) {
    return { error: "Demasiados intentos. Probá de nuevo en unos minutos." };
  }

  try {
    await signIn("nodemailer", { email: parsed.data.email, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "No pudimos enviar el link. Intentá de nuevo." };
    }
    throw error;
  }
}

export async function logout() {
  if (isMockMode) {
    redirect("/login");
  }
  await signOut({ redirectTo: "/login" });
}
