"use client";

import MuxPlayer from "@mux/mux-player-react";

export default function Player({
  playbackId,
  videoTitle,
  poster,
}: {
  playbackId: string;
  videoTitle: string;
  poster?: string;
}) {
  // Nada a configurar aqui para legendas ou idiomas de áudio: assim que
  // anexares faixas ao asset no Mux (ver scripts/mux-add-track.mjs), elas
  // passam a fazer parte do stream deste playbackId e o Mux Player mostra
  // os menus "CC" e "Áudio" automaticamente.
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      accentColor="#49E4D9"
      metadata={{
        video_title: videoTitle,
        viewer_user_id: "razonneplus-web",
      }}
      poster={poster}
      autoPlay
      className="h-full w-full"
    />
  );
}
