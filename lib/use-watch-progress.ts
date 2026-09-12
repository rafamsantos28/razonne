"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

type WatchProgressData = {
  id: number;
  user_id: number;
  item_slug: string;
  episode_key: string | null;
  current_time: number;
  duration: number;
  progress_percent: number;
  last_watched: string;
};

/**
 * Hook para guardar o progresso de reprodução automaticamente.
 * Guarda a cada 5 segundos de mudança na posição.
 */
export function useWatchProgress(
  itemSlug: string,
  episodeKey?: string
) {
  const { data: session } = useSession();
  const lastSavedTimeRef = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const saveProgress = useCallback(
    async (currentTime: number, duration: number) => {
      if (!session?.user?.id) return;

      // Só guardar se mudou mais de 5 segundos
      if (Math.abs(currentTime - lastSavedTimeRef.current) < 5) return;

      lastSavedTimeRef.current = currentTime;

      try {
        await fetch("/api/watch-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemSlug,
            currentTime,
            duration,
            episodeKey,
          }),
        });
      } catch (error) {
        console.error("Failed to save watch progress:", error);
      }
    },
    [session?.user?.id, itemSlug, episodeKey]
  );

  const clearProgress = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      await fetch("/api/watch-progress", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemSlug, episodeKey }),
      });
    } catch (error) {
      console.error("Failed to clear watch progress:", error);
    }
  }, [session?.user?.id, itemSlug, episodeKey]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return { saveProgress, clearProgress };
}

/**
 * Fetch do progresso guardado para um título.
 */
export async function getStoredProgress(
  itemSlug: string,
  episodeKey?: string
): Promise<WatchProgressData | null> {
  try {
    const params = new URLSearchParams({ itemSlug });
    if (episodeKey) params.append("episodeKey", episodeKey);

    const response = await fetch(`/api/watch-progress?${params}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch watch progress:", error);
    return null;
  }
}
