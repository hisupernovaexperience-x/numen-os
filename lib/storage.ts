"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

function readFromStorage<T>(key: string, initialValue: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initialValue;
  } catch {
    return initialValue;
  }
}

function getSnapshot<T>(key: string, initialValue: T): T {
  if (!cache.has(key)) cache.set(key, readFromStorage(key, initialValue));
  return cache.get(key) as T;
}

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function writeValue<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors
  }
  emit(key);
}

/** Sincroniza estado con localStorage entre todos los componentes de la misma pestaña que usen la misma key. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const subscribe = useCallback(
    (listener: Listener) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      const set = listeners.get(key)!;
      set.add(listener);
      return () => set.delete(listener);
    },
    [key],
  );

  const value = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key, initialValue),
    () => initialValue,
  );

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const prev = getSnapshot(key, initialValue);
      const next = typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
      writeValue(key, next);
    },
    [key, initialValue],
  );

  const hydrated = typeof window !== "undefined";

  return [value, setValue, hydrated] as const;
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
