import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { catalog, getTitleBySlug } from "@/lib/catalog";
import PosterArt from "@/components/PosterArt";

export function generateStaticParams() {
  return catalog.map((title) => ({ slug: title.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const title = getTitleBySlug(params.slug);
  if (!title) return { title: "Título não encontrado" };

  return {
    // Isto define o título da janela / separador do browser.
    title: title.title,
    description: title.synopsis,
    openGraph: {
      title: title.title,
      description: title.synopsis,
    },
  };
}

export default function TitleDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const title = getTitleBySlug(params.slug);
  if (!title) notFound();

  return (
    <article>
      <div className="relative h-[46vh] min-h-[320px] w-full overflow-hidden border-b border-rim/60">
        {title.backdrop ? (
          <Image src={title.backdrop} alt="" fill className="object-cover" />
        ) : (
          <PosterArt title={title.title} className="h-full w-full scale-125 blur-sm opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />
      </div>

      <div className="mx-auto -mt-20 max-w-content px-6 pb-20 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end">
          <div className="w-32 shrink-0 overflow-hidden rounded-md ring-1 ring-rim md:w-44">
            {title.poster ? (
              <Image
                src={title.poster}
                alt=""
                width={220}
                height={330}
                className="aspect-[2/3] w-full object-cover"
              />
            ) : (
              <PosterArt title={title.title} className="aspect-[2/3] w-full" />
            )}
          </div>

          <div className="max-w-2xl pb-1">
            <h1 className="font-display text-3xl font-semibold text-frost md:text-4xl">
              {title.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="chip">{title.year}</span>
              <span className="chip">{title.genre}</span>
              <span className="chip">{title.duration}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8 md:flex-row">
          <p className="max-w-2xl text-[15px] leading-relaxed text-mist">
            {title.synopsis}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {title.playbackId ? (
            <Link
              href={`/titulo/${title.slug}/reproduzir`}
              className="rounded-md bg-razonne-gradient px-6 py-3 text-sm font-medium text-void transition-opacity hover:opacity-90"
            >
              Assistir agora
            </Link>
          ) : (
            <span className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-mist">
              Vídeo por adicionar
            </span>
          )}
          <Link
            href="/"
            className="rounded-md border border-rim px-6 py-3 text-sm font-medium text-frost transition-colors hover:border-mist"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </article>
  );
}
