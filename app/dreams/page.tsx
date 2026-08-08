"use client";

import { useState } from "react";
import { useLocalStorage, newId } from "@/lib/storage";
import { todayISO, formatDate } from "@/lib/date";
import type { Dream, Mood } from "@/lib/types";
import { Button, Card, EmptyState, Label, PageHeader, Select, TextArea, TextInput } from "@/components/ui";

const MOODS: { value: Mood; label: string; icon: string }[] = [
  { value: "great", label: "Genial", icon: "✨" },
  { value: "good", label: "Bien", icon: "🙂" },
  { value: "neutral", label: "Neutral", icon: "😐" },
  { value: "bad", label: "Mal", icon: "😕" },
  { value: "nightmare", label: "Pesadilla", icon: "😱" },
];

function moodMeta(mood: Mood) {
  return MOODS.find((m) => m.value === mood) ?? MOODS[2];
}

export default function DreamsPage() {
  const [dreams, setDreams, hydrated] = useLocalStorage<Dream[]>("numen:dreams", []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayISO());
  const [lucid, setLucid] = useState(false);
  const [mood, setMood] = useState<Mood>("neutral");
  const [tags, setTags] = useState("");

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate(todayISO());
    setLucid(false);
    setMood("neutral");
    setTags("");
    setShowForm(false);
  }

  function addDream() {
    if (!title.trim()) return;
    const dream: Dream = {
      id: newId(),
      title: title.trim(),
      description: description.trim(),
      date,
      lucid,
      mood,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    setDreams((prev) => [dream, ...prev]);
    resetForm();
  }

  function removeDream(id: string) {
    setDreams((prev) => prev.filter((d) => d.id !== id));
  }

  const sorted = [...dreams].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Sueños" description="Registrá tus sueños apenas te despiertes." />
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "+ Nuevo"}</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid gap-3">
            <div>
              <Label htmlFor="d-title">Título</Label>
              <TextInput id="d-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Volaba sobre la ciudad" autoFocus />
            </div>
            <div>
              <Label htmlFor="d-desc">Descripción</Label>
              <TextArea id="d-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="¿Qué pasó en el sueño?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="d-date">Fecha</Label>
                <TextInput id="d-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="d-mood">Estado de ánimo</Label>
                <Select id="d-mood" value={mood} onChange={(e) => setMood(e.target.value as Mood)}>
                  {MOODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.icon} {m.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="d-tags">Tags (separados por coma)</Label>
              <TextInput id="d-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="vuelo, familia, recurrente" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={lucid} onChange={(e) => setLucid(e.target.checked)} className="size-4" />
              Fue un sueño lúcido
            </label>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={addDream} disabled={!title.trim()}>
                Guardar sueño
              </Button>
            </div>
          </div>
        </Card>
      )}

      {hydrated && sorted.length === 0 && !showForm && (
        <EmptyState icon="🌙" title="Todavía no hay sueños" hint="Agregá el primero apenas te despiertes, mientras lo recordás bien." />
      )}

      <div className="grid gap-3">
        {sorted.map((dream) => {
          const meta = moodMeta(dream.mood);
          return (
            <Card key={dream.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{dream.title}</h3>
                    {dream.lucid && (
                      <span className="text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-600 dark:text-violet-300">
                        Lúcido
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {formatDate(dream.date)} · {meta.icon} {meta.label}
                  </p>
                  {dream.description && <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">{dream.description}</p>}
                  {dream.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {dream.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/70">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="danger" onClick={() => removeDream(dream.id)} aria-label="Borrar sueño">
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
