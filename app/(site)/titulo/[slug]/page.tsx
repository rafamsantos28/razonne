import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  catalog,
  getItemBySlug,
  getMetaChips,
  episodeRouteSegment,
} from "@/lib/catalog";
import PosterArt from "@/components/PosterArt";

export function generateStaticParams() {
  return catalog.map((item) => ({ slug: item.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const item = getItemBySlug(params.slug);
  if (!item) return { title: "Título não encontrado" };

  return {
    // Isto define o título da janela / separador do browser.
    title: item.title,
    description: item.synopsis,
    openGraph: {
      title: item.title,
      description: item.synopsis,
    },
  };
}

export default function TitleDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = getItemBySlug(params.slug);
  if (!item) notFound();

  const chips = getMetaChips(item);

  return (
    <article className="min-h-screen">
      {/* Botão de voltar com seta */}
      <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-rim text-frost transition-colors hover:border-mist hover:text-mist"
          aria-label="Voltar ao catálogo"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      </div>

      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden border-b border-rim/60">
        {item.backdrop ? (
          <Image src={item.backdrop} alt="" fill className="object-cover" />
        ) : (
          <PosterArt title={item.title} className="h-full w-full scale-125 blur-sm opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
      </div>

      <div className="mx-auto -mt-20 max-w-content px-6 pb-20 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end">
          <div className="w-32 shrink-0 overflow-hidden rounded-md ring-1 ring-rim md:w-44">
            {item.poster ? (
              <Image
                src={item.poster}
                alt=""
                width={220}
                height={330}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <PosterArt title={item.title} className="aspect-[2/3] w-full" />
            )}
          </div>

          <div className="max-w-2xl pb-1">
            <div className="flex items-center gap-2">
              {item.kind === "show" && (
                <span className="chip">Série</span>
              )}
              <h1 className="font-display text-3xl font-semibold text-frost md:text-4xl">
                {item.title}
              </h1>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <span key={chip} className="chip">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 md:flex-row">
          <p className="max-w-2xl text-[15px] leading-relaxed text-mist">
            {item.synopsis}
          </p>
        </div>

        {item.kind === "movie" && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {item.playbackId ? (
              <Link
                href={`/titulo/${item.slug}/reproduzir`}
                className="rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
              >
                Assistir agora
              </Link>
            ) : (
              <span className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-mist">
                Vídeo por adicionar
              </span>
            )}
          </div>
        )}

        {item.kind === "show" && (
          <>
            <div className="mt-10 flex flex-col gap-10">
              {item.seasons.map((season) => (
                <div key={season.seasonNumber}>
                  <h2 className="font-display text-lg font-medium text-frost">
                    {season.title ?? `Temporada ${season.seasonNumber}`}
                  </h2>
                  <ul className="mt-4 divide-y divide-rim/60 rounded-md border border-rim/60">
                    {season.episodes.map((episode) => (
                      <li
                        key={episode.episodeNumber}
                        className="flex items-center justify-between gap-4 px-4 py-3.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-frost">
                            {episode.episodeNumber}. {episode.title}
                          </p>
                          {episode.synopsis && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-mist">
                              {episode.synopsis}
                            </p>
                          )}
                          {episode.duration && (
                            <p className="mt-1 text-xs text-mist">{episode.duration}</p>
                          )}
                        </div>
                        {episode.playbackId ? (
                          <Link
                            href={`/titulo/${item.slug}/reproduzir/${episodeRouteSegment(season.seasonNumber, episode.episodeNumber)}`}
                            className="shrink-0 rounded-md border border-rim px-4 py-2 text-xs font-medium text-frost transition-colors hover:border-mist"
                          >
                            Reproduzir
                          </Link>
                        ) : (
                          <span className="shrink-0 text-xs text-mist">Em breve</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
