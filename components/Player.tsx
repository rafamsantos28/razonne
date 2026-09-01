"use client";

import MuxPlayer from "@mux/mux-player-react";
import type { Title } from "@/lib/catalog";

export default function Player({ title }: { title: Title }) {
  // Nada a configurar aqui para legendas ou idiomas de áudio: assim que
  // anexares faixas ao asset no Mux (ver scripts/mux-add-track.mjs), elas
  // passam a fazer parte do stream deste playbackId e o Mux Player mostra
  // os menus "CC" e "Áudio" automaticamente.
  return (
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
    />
  );
}
