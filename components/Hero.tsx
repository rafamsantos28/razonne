import Link from "next/link";
import Image from "next/image";
import type { CatalogItem } from "@/lib/catalog";
import { getMetaChips, getPrimaryWatchHref } from "@/lib/catalog";
import PosterArt from "./PosterArt";

export default function Hero({ item }: { item: CatalogItem }) {
  const watchHref = getPrimaryWatchHref(item);
  const chips = getMetaChips(item);

  return (
    <section className="relative overflow-hidden border-b border-rim/60">
      <div className="absolute inset-0 -z-10">
        {item.backdrop ? (
          <Image src={item.backdrop} alt="" fill priority className="object-cover" />
        ) : (
          <PosterArt title={item.title} className="h-full w-full scale-125 blur-sm opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/40 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-content flex-col gap-5 px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span key={chip} className="chip">
              {chip}
            </span>
          ))}
        </div>
        <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.08] text-frost md:text-6xl">
          {item.title}
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-mist md:text-base">
          {item.synopsis}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {watchHref ? (
            <Link
              href={watchHref}
              className="rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              Reproduzir
            </Link>
          ) : (
            <span className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-mist">
              Em breve
            </span>
          )}
          <Link
            href={`/titulo/${item.slug}`}
            className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-frost transition-colors hover:border-mist"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </section>
  );
}
