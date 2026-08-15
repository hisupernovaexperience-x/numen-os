"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { Button, Label, TextInput } from "@/components/ui";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="grid gap-3">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <TextInput id="name" name="name" required autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <TextInput id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <TextInput id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        <p className="text-[11px] text-muted mt-1">Mínimo 8 caracteres, con letras, números y un carácter especial.</p>
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full mt-1">
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
      <p className="text-sm text-center text-muted">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-accent underline">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
