"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, signInWithGoogle, signInWithMagicLink } from "@/app/actions/auth";
import { Button, Label, TextInput } from "@/components/ui";

export default function LoginForm({
  googleEnabled,
  magicLinkEnabled,
}: {
  googleEnabled: boolean;
  magicLinkEnabled: boolean;
}) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [loginState, loginAction, loginPending] = useActionState(login, undefined);
  const [magicState, magicAction, magicPending] = useActionState(signInWithMagicLink, undefined);

  return (
    <div className="grid gap-4">
      {mode === "password" ? (
        <form action={loginAction} className="grid gap-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <TextInput id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          {loginState?.error && <p className="text-sm text-danger">{loginState.error}</p>}
          <Button type="submit" disabled={loginPending} className="w-full">
            {loginPending ? "Entrando…" : "Iniciar sesión"}
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="grid gap-3">
          <div>
            <Label htmlFor="magic-email">Email</Label>
            <TextInput id="magic-email" name="email" type="email" required autoComplete="email" />
          </div>
          {magicState?.error && <p className="text-sm text-danger">{magicState.error}</p>}
          <Button type="submit" disabled={magicPending} className="w-full">
            {magicPending ? "Enviando…" : "Enviarme un link mágico"}
          </Button>
          <p className="text-xs text-muted text-center">Te mandamos un link a tu email para entrar sin contraseña.</p>
        </form>
      )}

      {magicLinkEnabled && (
        <button
          type="button"
          onClick={() => setMode((m) => (m === "password" ? "magic" : "password"))}
          className="text-xs text-muted underline text-center"
        >
          {mode === "password" ? "Prefiero entrar sin contraseña" : "Prefiero usar mi contraseña"}
        </button>
      )}

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 text-xs text-muted">
            <div className="flex-1 h-px bg-border" /> o <div className="flex-1 h-px bg-border" />
          </div>
          <form action={signInWithGoogle}>
            <Button type="submit" variant="ghost" className="w-full border border-border">
              Continuar con Google
            </Button>
          </form>
        </>
      )}

      <p className="text-sm text-center text-muted">
        ¿No tenés cuenta?{" "}
        <Link href="/signup" className="text-accent underline">
          Creá una
        </Link>
      </p>
    </div>
  );
}
