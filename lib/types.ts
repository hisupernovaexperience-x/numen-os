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

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: HabitFrequency;
  completions: string[]; // ISO yyyy-mm-dd dates
  createdAt: string;
  archived: boolean;
}

export type GoalCategory = "personal" | "salud" | "trabajo" | "aprendizaje" | "finanzas" | "otro";
export type GoalStatus = "active" | "completed" | "paused";

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  targetDate: string | null; // ISO yyyy-mm-dd
  status: GoalStatus;
  milestones: Milestone[];
  createdAt: string;
}
