import Link from "next/link";
import Image from "next/image";
import type { Title } from "@/lib/catalog";
import PosterArt from "./PosterArt";

export default function Hero({ title }: { title: Title }) {
  return (
    <section className="relative overflow-hidden border-b border-rim/60">
      <div className="absolute inset-0 -z-10">
        {title.backdrop ? (
          <Image src={title.backdrop} alt="" fill priority className="object-cover" />
        ) : (
          <PosterArt title={title.title} className="h-full w-full scale-125 blur-sm opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/40 to-transparent" />
      </div>

      <div className="mx-auto flex max-w-content flex-col gap-5 px-6 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{title.year}</span>
          <span className="chip">{title.genre}</span>
          <span className="chip">{title.duration}</span>
        </div>
        <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.08] text-frost md:text-6xl">
          {title.title}
        </h1>
        <p className="max-w-md text-[15px] leading-relaxed text-mist md:text-base">
          {title.synopsis}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href={`/titulo/${title.slug}/reproduzir`}
            className="rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
          >
            Reproduzir
          </Link>
          <Link
            href={`/titulo/${title.slug}`}
            className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-frost transition-colors hover:border-mist"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </section>
  );
}
