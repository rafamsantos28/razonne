import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
    <div className="h-screen w-screen bg-black">
      <Player title={title} />
    </div>
  );
}
