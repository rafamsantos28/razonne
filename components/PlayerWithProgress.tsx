"use client";

import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { useWatchProgress } from "@/lib/use-watch-progress";

export default function PlayerWithProgress({
  playbackId,
  videoTitle,
  poster,
  itemSlug,
  episodeKey,
}: {
  playbackId: string;
  videoTitle: string;
  poster?: string;
  itemSlug: string;
  episodeKey?: string;
}) {
  const playerRef = useRef<any>(null);
  const [startTime, setStartTime] = useState(0);
  const { saveProgress } = useWatchProgress(itemSlug, episodeKey);

  // Recuperar o progresso guardado
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const params = new URLSearchParams({ itemSlug });
        if (episodeKey) params.append("episodeKey", episodeKey);

        const response = await fetch(`/api/watch-progress?${params}`);
        if (response.ok) {
          const data = await response.json();
          if (data?.current_time > 0) {
            setStartTime(data.current_time);
          }
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      }
    };

    fetchProgress();
  }, [itemSlug, episodeKey]);

  const handleTimeUpdate = (time: number) => {
    if (playerRef.current) {
      const duration = playerRef.current.duration || 0;
      saveProgress(time, duration);
    }
  };

  return (
    <MuxPlayer
      ref={playerRef}
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
      startTime={startTime}
      onTimeUpdate={(e) => handleTimeUpdate(e.detail?.currentTime ?? e.currentTarget.currentTime)}
    />
  );
}
