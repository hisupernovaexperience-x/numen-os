export type Mood = "great" | "good" | "neutral" | "bad" | "nightmare";

export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  lucid: boolean;
  mood: Mood;
  createdAt: string;
}

export type HabitFrequency = "daily" | "weekly";

export interface HabitEvidence {
  text: string;
  photoDataUrl: string | null;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  completions: Record<string, HabitEvidence>; // fecha ISO -> evidencia
  createdAt: string;
  archived: boolean;
}

export interface BirthPlace {
  country: string;
  city: string;
  locality: string;
}

export interface UserProfile {
  name: string;
  sex: "femenino" | "masculino" | "otro" | "prefiero_no_decir";
  birthDate: string; // ISO yyyy-mm-dd
  birthTime: string | null; // HH:mm, null si desconocida
  birthPlace: BirthPlace;
  onboardedAt: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
}
