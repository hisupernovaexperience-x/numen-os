"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { createHabit, deleteHabit, deleteHabitEvidence, saveHabitEvidence } from "@/app/actions/habits";
import { calcStreak, todayISO } from "@/lib/date";
import { fileToResizedDataUrl } from "@/lib/image";
import { Button, Card, EmptyState, Label, Modal, PageHeader, Select, TextArea, TextInput } from "@/components/ui";
import { CameraIcon, PulseIcon, TrashIcon } from "@/components/icons";

const MAX_TEXT = 500;

export interface HabitCompletionView {
  date: string;
  text: string;
  photoDataUrl: string | null;
}

export interface HabitView {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completions: HabitCompletionView[];
}

export default function HabitsBoard({ habits }: { habits: HabitView[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const [modalHabitId, setModalHabitId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [draftPhoto, setDraftPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = todayISO();
  const modalHabit = habits.find((h) => h.id === modalHabitId) ?? null;
  const isEditing = !!modalHabit?.completions.some((c) => c.date === today);

  function resetForm() {
    setName("");
    setFrequency("daily");
    setShowForm(false);
  }

  function handleCreateHabit() {
    if (!name.trim()) return;
    const habitName = name.trim();
    startTransition(async () => {
      try {
        await createHabit({ name: habitName, frequency });
        resetForm();
      } catch {
        setError("No pudimos crear el hábito.");
      }
    });
  }

  function handleDeleteHabit(habitId: string) {
    startTransition(async () => {
      try {
        await deleteHabit(habitId);
      } catch {
        setError("No pudimos borrar el hábito.");
      }
    });
  }

  function openModal(habit: HabitView) {
    const existing = habit.completions.find((c) => c.date === today);
    setDraftText(existing?.text ?? "");
    setDraftPhoto(existing?.photoDataUrl ?? null);
    setModalHabitId(habit.id);
    setError(null);
  }

  function closeModal() {
    setModalHabitId(null);
    setDraftText("");
    setDraftPhoto(null);
  }

  function toggleToday(habit: HabitView) {
    const done = habit.completions.some((c) => c.date === today);
    if (done) {
      startTransition(async () => {
        try {
          await deleteHabitEvidence(habit.id, today);
        } catch {
          setError("No pudimos destildar el hábito.");
        }
      });
    } else {
      openModal(habit);
    }
  }

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const dataUrl = await fileToResizedDataUrl(file);
    setDraftPhoto(dataUrl);
  }

  function saveEvidence() {
    if (!modalHabitId || (!draftText.trim() && !draftPhoto)) return;
    const habitId = modalHabitId;
    const text = draftText;
    const photoDataUrl = draftPhoto;
    startTransition(async () => {
      try {
        await saveHabitEvidence({ habitId, date: today, text, photoDataUrl });
        closeModal();
      } catch {
        setError("No pudimos guardar la evidencia.");
      }
    });
  }

  function deleteEvidence() {
    if (!modalHabitId) return;
    const habitId = modalHabitId;
    startTransition(async () => {
      try {
        await deleteHabitEvidence(habitId, today);
        closeModal();
      } catch {
        setError("No pudimos borrar la evidencia.");
      }
    });
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Hábitos" description="Marcá tu progreso con evidencia y sostené la racha." />
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Nuevo"}</Button>
      </div>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3">
            <div>
              <Label htmlFor="h-name">Nombre</Label>
              <TextInput id="h-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Meditar 10 minutos" autoFocus />
            </div>
            <div>
              <Label htmlFor="h-freq">Frecuencia</Label>
              <Select id="h-freq" value={frequency} onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleCreateHabit} disabled={!name.trim() || isPending}>
                Guardar hábito
              </Button>
            </div>
          </div>
        </Card>
      )}

      {habits.length === 0 && !showForm && (
        <EmptyState icon={<PulseIcon className="size-8" />} title="Todavía no hay hábitos" hint="Creá tu primer hábito y empezá a marcar tu progreso hoy mismo." />
      )}

      <div className="grid gap-3">
        {habits.map((habit) => {
          const evidence = habit.completions.find((c) => c.date === today);
          const done = !!evidence;
          const streak = calcStreak(habit.completions.map((c) => c.date));
          return (
            <Card key={habit.id}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleToday(habit)}
                  disabled={isPending}
                  aria-pressed={done}
                  aria-label={done ? "Marcar como no hecho hoy" : "Marcar como hecho hoy"}
                  className={`size-9 shrink-0 rounded-full border flex items-center justify-center text-lg transition-colors ${
                    done ? "bg-accent border-accent text-accent-foreground" : "border-border text-transparent hover:border-accent/60"
                  }`}
                >
                  ✓
                </button>
                <button className="min-w-0 flex-1 text-left" onClick={() => done && openModal(habit)} disabled={!done}>
                  <p className="font-medium truncate">{habit.name}</p>
                  <p className="text-xs text-muted">
                    {habit.frequency === "daily" ? "Diaria" : "Semanal"}
                    {streak > 0 && <span className="ml-2 text-accent">{streak} {streak === 1 ? "día" : "días"} de racha</span>}
                    {done && <span className="ml-2 underline">ver / editar evidencia</span>}
                  </p>
                </button>
                <Button variant="danger" onClick={() => handleDeleteHabit(habit.id)} aria-label="Borrar hábito" disabled={isPending}>
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!modalHabit} onClose={closeModal} title={modalHabit ? modalHabit.name : ""}>
        <div className="grid gap-3">
          <p className="text-xs text-muted -mt-1">Cargá una foto y/o un texto como evidencia. Al menos uno es obligatorio.</p>

          <div>
            <Label htmlFor="ev-text">Texto (opcional si hay foto)</Label>
            <TextArea
              id="ev-text"
              rows={4}
              maxLength={MAX_TEXT}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="¿Cómo te fue con este hábito hoy?"
            />
            <p className="text-[11px] text-muted text-right mt-0.5">{draftText.length}/{MAX_TEXT}</p>
          </div>

          <div>
            <Label>Foto (opcional si hay texto)</Label>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
            {draftPhoto ? (
              <div className="relative w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={draftPhoto} alt="Evidencia" className="max-h-48 rounded-lg border border-border" />
                <button
                  onClick={() => setDraftPhoto(null)}
                  aria-label="Quitar foto"
                  className="absolute -top-2 -right-2 size-6 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-danger"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()} className="border border-dashed border-border">
                <CameraIcon className="size-4" />
                Agregar foto
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            {isEditing ? (
              <Button variant="danger" onClick={deleteEvidence} disabled={isPending}>
                Borrar evidencia
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={saveEvidence} disabled={isPending || (!draftText.trim() && !draftPhoto)}>
                {isEditing ? "Guardar cambios" : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
