"use client";

import { useState } from "react";
import { useLocalStorage, newId } from "@/lib/storage";
import { calcStreak, todayISO } from "@/lib/date";
import type { Habit, HabitFrequency } from "@/lib/types";
import { Button, Card, EmptyState, Label, PageHeader, Select, TextInput } from "@/components/ui";

export default function HabitsPage() {
  const [habits, setHabits, hydrated] = useLocalStorage<Habit[]>("numen:habits", []);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");

  function resetForm() {
    setName("");
    setFrequency("daily");
    setShowForm(false);
  }

  function addHabit() {
    if (!name.trim()) return;
    const habit: Habit = {
      id: newId(),
      name: name.trim(),
      description: "",
      frequency,
      completions: [],
      createdAt: new Date().toISOString(),
      archived: false,
    };
    setHabits((prev) => [habit, ...prev]);
    resetForm();
  }

  function toggleToday(id: string) {
    const today = todayISO();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const done = h.completions.includes(today);
        return {
          ...h,
          completions: done ? h.completions.filter((d) => d !== today) : [...h.completions, today],
        };
      }),
    );
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  const today = todayISO();
  const active = habits.filter((h) => !h.archived);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Hábitos" description="Marcá tu progreso día a día y sostené la racha." />
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Nuevo"}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3">
            <div>
              <Label htmlFor="h-name">Nombre</Label>
              <TextInput id="h-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Meditar 10 minutos" autoFocus />
            </div>
            <div>
              <Label htmlFor="h-freq">Frecuencia</Label>
              <Select id="h-freq" value={frequency} onChange={(e) => setFrequency(e.target.value as HabitFrequency)}>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={addHabit} disabled={!name.trim()}>
                Guardar hábito
              </Button>
            </div>
          </div>
        </Card>
      )}

      {hydrated && active.length === 0 && !showForm && (
        <EmptyState icon="✅" title="Todavía no hay hábitos" hint="Creá tu primer hábito y empezá a marcar tu progreso hoy mismo." />
      )}

      <div className="grid gap-3">
        {active.map((habit) => {
          const done = habit.completions.includes(today);
          const streak = calcStreak(habit.completions);
          return (
            <Card key={habit.id}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleToday(habit.id)}
                  aria-pressed={done}
                  aria-label={done ? "Marcar como no hecho hoy" : "Marcar como hecho hoy"}
                  className={`size-9 shrink-0 rounded-full border flex items-center justify-center text-lg transition-colors ${
                    done
                      ? "bg-emerald-500/90 border-emerald-500 text-white"
                      : "border-black/20 dark:border-white/20 text-transparent hover:border-foreground/40"
                  }`}
                >
                  ✓
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{habit.name}</p>
                  <p className="text-xs text-foreground/50">
                    {habit.frequency === "daily" ? "Diaria" : "Semanal"}
                    {streak > 0 && (
                      <span className="ml-2 text-amber-600 dark:text-amber-400">
                        🔥 {streak} {streak === 1 ? "día" : "días"} de racha
                      </span>
                    )}
                  </p>
                </div>
                <Button variant="danger" onClick={() => removeHabit(habit.id)} aria-label="Borrar hábito">
                  ✕
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
