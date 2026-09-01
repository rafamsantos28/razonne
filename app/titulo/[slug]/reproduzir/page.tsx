import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getTitleBySlug } from "@/lib/catalog";
import Player from "@/components/Player";

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
  return { title: title.title };
}

export default function PlayerPage({
  params,
}: {
  params: { slug: string };
}) {
  const title = getTitleBySlug(params.slug);
  if (!title) notFound();

  if (!title.playbackId) {
    return (
      <div className="mx-auto flex max-w-content flex-col items-start gap-4 px-6 py-24 md:px-10">
        <p className="text-sm text-mist">
          &ldquo;{title.title}&rdquo; ainda não tem um vídeo associado.
        </p>
        <Link
          href={`/titulo/${title.slug}`}
          className="rounded-md border border-rim px-5 py-2.5 text-sm text-frost transition-colors hover:border-mist"
        >
          Voltar aos detalhes
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        <Link
          href={`/titulo/${title.slug}`}
          className="text-sm text-mist transition-colors hover:text-frost"
        >
          ← {title.title}
        </Link>
      </div>
      <div className="mx-auto max-w-content px-0 md:px-10 md:pb-14">
        <Player title={title} />
      </div>
    </div>
  );
}
