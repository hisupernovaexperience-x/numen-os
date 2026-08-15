"use client";

import { useActionState, useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { Button, Label, Select, TextInput } from "@/components/ui";
import { SparkleIcon } from "@/components/icons";

export default function OnboardingForm() {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  const [birthTime, setBirthTime] = useState("");

  if (pending) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <SparkleIcon className="size-10 text-accent animate-pulse" />
        <p className="text-lg font-medium">Cargando tu juego…</p>
        <p className="text-sm text-muted max-w-xs">Calculando tu carta y tus primeras misiones.</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <div>
        <Label htmlFor="name">Nombre completo</Label>
        <TextInput id="name" name="name" placeholder="Tu nombre" autoFocus required />
      </div>

      <div>
        <Label htmlFor="sex">Sexo</Label>
        <Select id="sex" name="sex" defaultValue="prefiero_no_decir">
          <option value="femenino">Femenino</option>
          <option value="masculino">Masculino</option>
          <option value="otro">Otro</option>
          <option value="prefiero_no_decir">Prefiero no decir</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <TextInput id="birthDate" name="birthDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="birthTime">Hora de nacimiento</Label>
          <TextInput id="birthTime" name="birthTime" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
        </div>
      </div>
      {!birthTime && (
        <p className="text-xs text-muted -mt-2">
          Si no sabés tu hora exacta podés continuar igual, pero puede afectar la precisión del cálculo.
        </p>
      )}

      <div>
        <Label htmlFor="country">País</Label>
        <TextInput id="country" name="country" placeholder="Argentina" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <TextInput id="city" name="city" placeholder="Buenos Aires" required />
        </div>
        <div>
          <Label htmlFor="locality">Localidad</Label>
          <TextInput id="locality" name="locality" placeholder="Opcional" />
        </div>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" className="mt-2 w-full">
        Confirmar y entrar
      </Button>
    </form>
  );
}
