import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  catalog,
  getItemBySlug,
  parseEpisodeSegment,
  findEpisode,
  getNextEpisode,
  episodeRouteSegment,
  type Show,
  type Episode,
} from "@/lib/catalog";
import Player from "@/components/Player";

function resolveEpisode(
  slug: string,
  episodio: string
): { show: Show; seasonNumber: number; episode: Episode } | null {
  const item = getItemBySlug(slug);
  if (!item || item.kind !== "show") return null;

  const parsed = parseEpisodeSegment(episodio);
  if (!parsed) return null;

  const episode = findEpisode(item, parsed.season, parsed.episode);
  if (!episode) return null;

  return { show: item, seasonNumber: parsed.season, episode };
}

export function generateStaticParams() {
  const params: { slug: string; episodio: string }[] = [];
  for (const item of catalog) {
    if (item.kind !== "show") continue;
    for (const season of item.seasons) {
      for (const episode of season.episodes) {
        params.push({
          slug: item.slug,
          episodio: episodeRouteSegment(season.seasonNumber, episode.episodeNumber),
        });
      }
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { slug: string; episodio: string };
}): Metadata {
  const resolved = resolveEpisode(params.slug, params.episodio);
  if (!resolved) return { title: "Episódio não encontrado" };
  // Isto define o título da janela / separador do browser.
  return { title: `${resolved.episode.title} — ${resolved.show.title}` };
}

export default function EpisodePlayerPage({
  params,
}: {
  params: { slug: string; episodio: string };
}) {
  const resolved = resolveEpisode(params.slug, params.episodio);
  if (!resolved) notFound();

  const { show, seasonNumber, episode } = resolved;
  const next = getNextEpisode(show, seasonNumber, episode.episodeNumber);

  return (
    // Ecrã inteiro e por cima de tudo: esta rota vive fora do grupo (site),
    // por isso não herda o Header nem o Footer.
    <div className="fixed inset-0 z-50 bg-black">
      <Link
        href={`/titulo/${show.slug}`}
        aria-label={`Voltar aos detalhes de ${show.title}`}
        className="absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-frost ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-black/75 hover:text-teal-soft md:left-6"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {episode.playbackId ? (
        <>
          <Player
            playbackId={episode.playbackId}
            videoTitle={`${show.title} — ${episode.title}`}
            poster={show.backdrop}
          />
          {next?.episode.playbackId && (
            <Link
              href={`/titulo/${show.slug}/reproduzir/${episodeRouteSegment(next.seasonNumber, next.episode.episodeNumber)}`}
              className="absolute bottom-6 right-4 z-10 flex items-center gap-2 rounded-full bg-black/55 px-4 py-2.5 text-xs font-medium text-frost ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-black/75 md:right-6"
            >
              Próximo episódio
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-mist">
            &ldquo;{episode.title}&rdquo; ainda não tem um vídeo associado.
          </p>
          <Link
            href={`/titulo/${show.slug}`}
            className="rounded-md border border-rim px-5 py-2.5 text-sm text-frost transition-colors hover:border-mist"
          >
            Voltar aos detalhes
          </Link>
        </div>
      )}
    </div>
  );
}
