import Link from "next/link";
import Image from "next/image";
import type { CatalogItem } from "@/lib/catalog";
import { hasPlayableVideo } from "@/lib/catalog";
import PosterArt from "./PosterArt";

export default function VideoCard({ item }: { item: CatalogItem }) {
  return (
    <Link
      href={`/titulo/${item.slug}`}
      className="group block"
      aria-label={`Ver detalhes de ${item.title}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-panel ring-1 ring-rim transition-[filter] duration-300 group-hover:brightness-110">
        {item.poster ? (
          <Image
            src={item.poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 220px, 40vw"
            className="object-cover"
          />
        ) : (
          <PosterArt title={item.title} className="h-full w-full" />
        )}
        {item.kind === "show" && (
          <span className="absolute left-2 top-2 rounded-full bg-void/80 px-2 py-0.5 text-[11px] text-mist ring-1 ring-rim">
            Série
          </span>
        )}
        {!hasPlayableVideo(item) && (
          <span className="absolute right-2 top-2 rounded-full bg-void/80 px-2 py-0.5 text-[11px] text-mist ring-1 ring-rim">
            Em breve
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-display text-[15px] font-medium leading-snug text-frost group-hover:text-teal-soft">
          {item.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-2 text-[13px] text-mist">
          <span>{item.year}</span>
          <span className="h-3 w-px bg-rim" aria-hidden="true" />
          <span>{item.genre}</span>
        </p>
      </div>
    </Link>
  );
}
