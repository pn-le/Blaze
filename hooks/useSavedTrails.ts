"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedTrail } from "@/types";

const KEY = "blaze_trails";
const MAX = 6;

function load(): SavedTrail[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useSavedTrails() {
  const [trails, setTrails] = useState<SavedTrail[]>([]);

  useEffect(() => {
    setTrails(load());
  }, []);

  const save = useCallback((trail: Omit<SavedTrail, "savedAt">) => {
    setTrails((prev) => {
      const filtered = prev.filter(
        (t) => !(t.lat === trail.lat && t.lng === trail.lng)
      );
      const next: SavedTrail[] = [
        ...filtered,
        { ...trail, savedAt: Date.now() },
      ];
      // Keep only newest MAX
      const trimmed = next.slice(-MAX);
      localStorage.setItem(KEY, JSON.stringify(trimmed));
      return trimmed;
    });
  }, []);

  const remove = useCallback((lat: number, lng: number) => {
    setTrails((prev) => {
      const next = prev.filter((t) => !(t.lat === lat && t.lng === lng));
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { trails, save, remove };
}
