"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { catalog, getItemBySlug } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";

type ProgressItem = {
  id: number;
  user_id: number;
  item_slug: string;
  episode_key: string | null;
  current_time: number;
  duration: number;
  progress_percent: number;
  last_watched: string;
};

export default function ContinueWatchingSection() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const fetchContinueWatching = async () => {
      try {
        const response = await fetch("/api/watch-progress");
        if (response.ok) {
          const data = await response.json();
          setItems(Array.isArray(data) ? data.slice(0, 6) : []);
        }
      } catch (error) {
        console.error("Failed to fetch continue watching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContinueWatching();
  }, [session?.user?.id]);

  if (!session?.user?.id || items.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <h2 className="text-3xl font-display font-bold text-frost mb-6">Continuar a Ver</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const catalogItem = getItemBySlug(item.item_slug);
          if (!catalogItem) return null;

          const watchHref =
            catalogItem.kind === "movie"
              ? `/titulo/${item.item_slug}/reproduzir`
              : `/titulo/${item.item_slug}/reproduzir/${item.episode_key}`;

          return (
            <Link
              key={`${item.item_slug}-${item.episode_key}`}
              href={watchHref}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="relative w-full aspect-video bg-panel">
                {catalogItem.poster && (
                  <Image
                    src={catalogItem.poster}
                    alt={catalogItem.title}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                )}
                {/* Barra de progresso */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-panel/50">
                  <div
                    className="h-full bg-teal transition-all"
                    style={{ width: `${item.progress_percent}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-mist mt-2 truncate">
                {catalogItem.title}
              </p>
              <p className="text-xs text-mist/70">
                {Math.round(item.progress_percent)}% visto
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
