"use client";

import { useState } from "react";
import { useLocalStorage, newId } from "@/lib/storage";
import { formatDate } from "@/lib/date";
import type { Goal, GoalCategory, Milestone } from "@/lib/types";
import { Button, Card, EmptyState, Label, PageHeader, Select, TextInput } from "@/components/ui";

const CATEGORIES: { value: GoalCategory; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "salud", label: "Salud" },
  { value: "trabajo", label: "Trabajo" },
  { value: "aprendizaje", label: "Aprendizaje" },
  { value: "finanzas", label: "Finanzas" },
  { value: "otro", label: "Otro" },
];

function progress(goal: Goal): number {
  if (goal.milestones.length === 0) return goal.status === "completed" ? 100 : 0;
  const done = goal.milestones.filter((m) => m.done).length;
  return Math.round((done / goal.milestones.length) * 100);
}

export default function GoalsPage() {
  const [goals, setGoals, hydrated] = useLocalStorage<Goal[]>("numen:goals", []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalCategory>("personal");
  const [targetDate, setTargetDate] = useState("");
  const [milestoneDraft, setMilestoneDraft] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  function resetForm() {
    setTitle("");
    setCategory("personal");
    setTargetDate("");
    setMilestoneDraft("");
    setMilestones([]);
    setShowForm(false);
  }

  function addMilestoneDraft() {
    if (!milestoneDraft.trim()) return;
    setMilestones((prev) => [...prev, { id: newId(), title: milestoneDraft.trim(), done: false }]);
    setMilestoneDraft("");
  }

  function addGoal() {
    if (!title.trim()) return;
    const goal: Goal = {
      id: newId(),
      title: title.trim(),
      description: "",
      category,
      targetDate: targetDate || null,
      status: "active",
      milestones,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [goal, ...prev]);
    resetForm();
  }

  function removeGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function toggleMilestone(goalId: string, milestoneId: string) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m));
        const allDone = milestones.length > 0 && milestones.every((m) => m.done);
        return { ...g, milestones, status: allDone ? "completed" : g.status === "completed" ? "active" : g.status };
      }),
    );
  }

  const sorted = [...goals].sort((a, b) => {
    if (a.status !== b.status) return a.status === "completed" ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Objetivos" description="Definí metas y dividilas en pasos concretos." />
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Nuevo"}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3">
            <div>
              <Label htmlFor="g-title">Título</Label>
              <TextInput id="g-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Correr una media maratón" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="g-cat">Categoría</Label>
                <Select id="g-cat" value={category} onChange={(e) => setCategory(e.target.value as GoalCategory)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="g-date">Fecha objetivo</Label>
                <TextInput id="g-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="g-milestone">Pasos / hitos</Label>
              <div className="flex gap-2">
                <TextInput
                  id="g-milestone"
                  value={milestoneDraft}
                  onChange={(e) => setMilestoneDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMilestoneDraft();
                    }
                  }}
                  placeholder="Ej: Correr 10km sin parar"
                />
                <Button type="button" variant="ghost" onClick={addMilestoneDraft}>
                  Agregar
                </Button>
              </div>
              {milestones.length > 0 && (
                <ul className="mt-2 grid gap-1">
                  {milestones.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm bg-black/5 dark:bg-white/10 rounded-lg px-3 py-1.5">
                      {m.title}
                      <button
                        type="button"
                        onClick={() => setMilestones((prev) => prev.filter((x) => x.id !== m.id))}
                        className="text-foreground/40 hover:text-red-500"
                        aria-label="Quitar hito"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={addGoal} disabled={!title.trim()}>
                Guardar objetivo
              </Button>
            </div>
          </div>
        </Card>
      )}

      {hydrated && sorted.length === 0 && !showForm && (
        <EmptyState icon="🎯" title="Todavía no hay objetivos" hint="Creá tu primer objetivo y dividilo en pasos chicos y concretos." />
      )}

      <div className="grid gap-3">
        {sorted.map((goal) => {
          const pct = progress(goal);
          const completed = goal.status === "completed";
          return (
            <Card key={goal.id} className={completed ? "opacity-60" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-medium ${completed ? "line-through" : ""}`}>{goal.title}</h3>
                    <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-foreground/60">
                      {CATEGORIES.find((c) => c.value === goal.category)?.label}
                    </span>
                  </div>
                  {goal.targetDate && <p className="text-xs text-foreground/50 mt-0.5">Meta: {formatDate(goal.targetDate)}</p>}

                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-foreground/60 w-9 text-right">{pct}%</span>
                  </div>

                  {goal.milestones.length > 0 && (
                    <ul className="mt-3 grid gap-1.5">
                      {goal.milestones.map((m) => (
                        <li key={m.id}>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              checked={m.done}
                              onChange={() => toggleMilestone(goal.id, m.id)}
                              className="size-4 shrink-0"
                            />
                            <span className={m.done ? "line-through text-foreground/50" : ""}>{m.title}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <Button variant="danger" onClick={() => removeGoal(goal.id)} aria-label="Borrar objetivo">
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
