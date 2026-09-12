"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useWatchlist } from "@/lib/use-watchlist";

export default function WatchlistButton({ itemSlug }: { itemSlug: string }) {
  const { data: session } = useSession();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const checkWatchlist = async () => {
      const isSaved = await isInWatchlist(itemSlug);
      setInWatchlist(isSaved);
    };

    checkWatchlist();
  }, [session?.user?.id, itemSlug, isInWatchlist]);

  if (!session?.user?.id) {
    return null; // Ocultar botão para utilizadores não autenticados
  }

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(itemSlug);
      } else {
        await addToWatchlist(itemSlug);
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error("Failed to toggle watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition ${
        inWatchlist
          ? "bg-bloom text-void hover:bg-bloom-soft"
          : "bg-panel text-frost hover:bg-rim"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? "..." : inWatchlist ? "✓ A Minha Razonne+" : "+ A Minha Razonne+"}
    </button>
  );
}
