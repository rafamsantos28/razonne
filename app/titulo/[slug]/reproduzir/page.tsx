import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { catalog, getItemBySlug, getPrimaryWatchHref } from "@/lib/catalog";
import Player from "@/components/Player";

export function generateStaticParams() {
  return catalog
    .filter((item) => item.kind === "movie")
    .map((item) => ({ slug: item.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const item = getItemBySlug(params.slug);
  if (!item) return { title: "Título não encontrado" };
  return { title: item.title };
}

export default function PlayerPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = getItemBySlug(params.slug);
  if (!item) notFound();

  // Uma série não tem um único vídeo — manda para o primeiro episódio
  // disponível (ou para os detalhes, se ainda não houver nenhum).
  if (item.kind === "show") {
    redirect(getPrimaryWatchHref(item) ?? `/titulo/${item.slug}`);
  }

  return (
    // Ecrã inteiro e por cima de tudo: esta rota vive fora do grupo (site),
    // por isso não herda o Header nem o Footer.
    <div className="fixed inset-0 z-50 bg-black">
      <Link
        href={`/titulo/${item.slug}`}
        aria-label={`Voltar aos detalhes de ${item.title}`}
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

      {item.playbackId ? (
        <Player playbackId={item.playbackId} videoTitle={item.title} poster={item.backdrop} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-mist">
            &ldquo;{item.title}&rdquo; ainda não tem um vídeo associado.
          </p>
          <Link
            href={`/titulo/${item.slug}`}
            className="rounded-md border border-rim px-5 py-2.5 text-sm text-frost transition-colors hover:border-mist"
          >
            Voltar aos detalhes
          </Link>
        </div>
      )}
    </div>
  );
}
