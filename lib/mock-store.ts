import "server-only";

export const DEMO_USER_ID = "demo-user";

export interface MockProfile {
  name: string;
  sex: string;
  birthDate: string; // ISO yyyy-mm-dd
  birthTime: string | null;
  country: string;
  city: string;
  locality: string | null;
}

export interface MockHabitCompletion {
  date: string; // ISO yyyy-mm-dd
  text: string;
  photoDataUrl: string | null;
}

export interface MockHabit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  createdAt: string;
  completions: MockHabitCompletion[];
}

export interface MockDream {
  id: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  lucid: boolean;
  mood: string;
  createdAt: string;
}

interface MockDB {
  profile: MockProfile | null;
  habits: MockHabit[];
  dreams: MockDream[];
}

// Singleton a nivel de módulo: vive mientras corre el proceso de `next dev`.
// Se resetea al reiniciar el server — es intencional, es solo para prototipar.
const globalForMock = globalThis as unknown as { __numenMockDB?: MockDB };

export const mockDB: MockDB =
  globalForMock.__numenMockDB ?? (globalForMock.__numenMockDB = { profile: null, habits: [], dreams: [] });

export function newMockId(): string {
  return `mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
