"use client";

import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import type { Title } from "@/lib/catalog";

export default function Player({
  title,
  slug,
}: {
  title: Title;
  slug: string;
}) {
  return (
    <div className="relative h-screen w-screen bg-black">
      <MuxPlayer
        playbackId={title.playbackId}
        streamType="on-demand"
        accentColor="#49E4D9"
        metadata={{
          video_title: title.title,
          viewer_user_id: "razonneplus-web",
        }}
        poster={title.backdrop}
        autoPlay
        className="h-full w-full"
        style={{ aspectRatio: "16 / 9" }}
      />
      <Link
        href={`/titulo/${slug}`}
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
    </div>
  );
}
