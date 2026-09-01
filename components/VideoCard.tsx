import Link from "next/link";
import Image from "next/image";
import type { Title } from "@/lib/catalog";
import PosterArt from "./PosterArt";

export default function VideoCard({ title }: { title: Title }) {
  return (
    <Link
      href={`/titulo/${title.slug}`}
      className="group block"
      aria-label={`Ver detalhes de ${title.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-panel ring-1 ring-rim transition-[filter] duration-300 group-hover:brightness-110">
        {title.poster ? (
          <Image
            src={title.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, 40vw"
            className="object-cover"
          />
        ) : (
          <PosterArt title={title.title} className="h-full w-full" />
        )}
        {!title.playbackId && (
          <span className="absolute right-2 top-2 rounded-full bg-void/80 px-2 py-0.5 text-[11px] text-mist ring-1 ring-rim">
            Em breve
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display text-[15px] font-medium leading-snug text-frost group-hover:text-teal-soft">
          {title.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-2 text-[13px] text-mist">
          <span>{title.year}</span>
          <span className="h-3 w-px bg-rim" aria-hidden="true" />
          <span>{title.genre}</span>
        </p>
      </div>
    </Link>
  );
}
