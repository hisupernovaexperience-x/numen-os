"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/lib/storage";
import type { BirthPlace, UserProfile } from "@/lib/types";
import { Button, Label, Select, TextInput } from "@/components/ui";
import { SparkleIcon } from "@/components/icons";

type Sex = UserProfile["sex"];

export default function OnboardingPage() {
  const router = useRouter();
  const [, setProfile] = useLocalStorage<UserProfile | null>("numen:profile", null);

  const [step, setStep] = useState<"form" | "loading">("form");
  const [name, setName] = useState("");
  const [sex, setSex] = useState<Sex>("prefiero_no_decir");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [place, setPlace] = useState<BirthPlace>({ country: "", city: "", locality: "" });

  const canSubmit = name.trim() && birthDate && place.country.trim() && place.city.trim();

  function handleSubmit() {
    if (!canSubmit) return;
    setStep("loading");
    const profile: UserProfile = {
      name: name.trim(),
      sex,
      birthDate,
      birthTime: birthTime || null,
      birthPlace: place,
      onboardedAt: new Date().toISOString(),
    };
    window.setTimeout(() => {
      setProfile(profile);
      router.push("/");
    }, 1600);
  }

  if (step === "loading") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 px-6 text-center">
        <SparkleIcon className="size-10 text-accent animate-pulse" />
        <p className="text-lg font-medium">Cargando tu juego…</p>
        <p className="text-sm text-muted max-w-xs">Calculando tu carta y tus primeras misiones.</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Configurá tu partida</h1>
          <p className="text-sm text-muted mt-1">
            Con tus datos de nacimiento armamos tu carta y te sugerimos qué venís a integrar en esta vida.
          </p>
        </div>

        <div className="grid gap-3">
          <div>
            <Label htmlFor="ob-name">Nombre completo</Label>
            <TextInput id="ob-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" autoFocus />
          </div>

          <div>
            <Label htmlFor="ob-sex">Sexo</Label>
            <Select id="ob-sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
              <option value="prefiero_no_decir">Prefiero no decir</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ob-date">Fecha de nacimiento</Label>
              <TextInput id="ob-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ob-time">Hora de nacimiento</Label>
              <TextInput id="ob-time" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
            </div>
          </div>
          {!birthTime && (
            <p className="text-xs text-muted -mt-2">
              Si no sabés tu hora exacta podés continuar igual, pero puede afectar la precisión del cálculo.
            </p>
          )}

          <div>
            <Label htmlFor="ob-country">País</Label>
            <TextInput
              id="ob-country"
              value={place.country}
              onChange={(e) => setPlace((p) => ({ ...p, country: e.target.value }))}
              placeholder="Argentina"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ob-city">Ciudad</Label>
              <TextInput
                id="ob-city"
                value={place.city}
                onChange={(e) => setPlace((p) => ({ ...p, city: e.target.value }))}
                placeholder="Buenos Aires"
              />
            </div>
            <div>
              <Label htmlFor="ob-locality">Localidad</Label>
              <TextInput
                id="ob-locality"
                value={place.locality}
                onChange={(e) => setPlace((p) => ({ ...p, locality: e.target.value }))}
                placeholder="Opcional"
              />
            </div>
          </div>

          <Button className="mt-2 w-full" onClick={handleSubmit} disabled={!canSubmit}>
            Confirmar y entrar
          </Button>
        </div>
      </div>
    </div>
  );
}
