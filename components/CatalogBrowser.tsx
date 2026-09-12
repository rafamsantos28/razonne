"use client";

import { useMemo, useState } from "react";
import type { CatalogItem } from "@/lib/catalog";
import { goodMatches, searchCatalog } from "@/lib/search";
import VideoCard from "./VideoCard";

export default function CatalogBrowser({ items }: { items: CatalogItem[] }) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    const matches = searchCatalog(items, trimmedQuery);
    if (!trimmedQuery) return { list: matches.map((m) => m.item), approximate: false };

    const good = goodMatches(matches);
    if (good.length > 0) {
      return { list: good.map((m) => m.item), approximate: false };
    }

    // Não há nenhum título parecido o suficiente com o que foi escrito —
    // ainda assim mostramos os mais próximos em vez de "0 resultados".
    return { list: matches.slice(0, 8).map((m) => m.item), approximate: true };
  }, [items, trimmedQuery]);

  return (
    <>
      <div className="relative max-w-md">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m1.35-5.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar filmes e séries…"
          aria-label="Pesquisar no catálogo"
          className="w-full rounded-md border border-rim bg-panel py-3 pl-11 pr-4 text-sm text-frost placeholder:text-mist focus:border-teal focus:outline-none"
        />
      </div>

      <p className="mt-4 text-sm text-mist">
        {trimmedQuery
          ? `${results.list.length} ${results.list.length === 1 ? "resultado" : "resultados"} para "${trimmedQuery}"`
          : `${items.length} títulos disponíveis`}
      </p>

      {results.approximate && (
        <p className="mt-1 text-sm text-mist/80">
          Não encontrámos exatamente isso, mas talvez seja um destes títulos:
        </p>
      )}

      {results.list.length === 0 ? (
        <p className="mt-8 text-sm text-mist">
          Não encontrámos nenhum título parecido com "{trimmedQuery}".
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {results.list.map((item) => (
            <VideoCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
