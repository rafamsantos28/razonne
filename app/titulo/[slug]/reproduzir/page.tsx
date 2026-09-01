import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTitleBySlug } from "@/lib/catalog";
import Player from "@/components/Player";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) return { title: "Título não encontrado" };
  return { title: `${title.title} - Reproduzir` };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = getTitleBySlug(slug);
  if (!title) notFound();

  if (!title.playbackId) {
    notFound();
  }

  return (
    <div className="relative h-screen w-screen bg-black">
      <Link
        href={`/titulo/${title.slug}`}
        className="absolute left-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-all hover:bg-white/20"
        aria-label="Voltar aos detalhes do filme"
      >
        <svg
          className="h-6 w-6"
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
      <Player title={title} />
    </div>
  );
}
