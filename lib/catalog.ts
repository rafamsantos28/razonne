/** Um idioma de legendas ou de áudio já anexado ao asset no Mux. */
export type TrackInfo = {
  /** Código de idioma BCP-47, ex: "pt", "en", "es". */
  lang: string;
  /** Nome mostrado no menu do leitor, ex: "Português". */
  name: string;
};

type BaseItem = {
  /** Identificador usado no URL, ex: /titulo/nevoa-alta */
  slug: string;
  title: string;
  synopsis: string;
  year: number;
  genre: string;
  /**
   * Caminhos opcionais para imagens reais. Coloca os ficheiros em
   * public/posters/ (retrato) e public/backdrops/ (paisagem) e aponta
   * para eles como "/posters/ficheiro.jpg" e "/backdrops/ficheiro.jpg" —
   * ou usa uma URL https completa se hospedares noutro sítio. Se ficarem
   * por preencher, o site desenha automaticamente uma capa gerada com as
   * cores da marca.
   */
  poster?: string;
  backdrop?: string;
  featured?: boolean;
};

export type Movie = BaseItem & {
  kind: "movie";
  duration: string; // ex: "1h 42m"
  /** Playback ID do asset no Mux. Deixa "" se ainda não tiveres o vídeo. */
  playbackId: string;
  /**
   * Asset ID do Mux (diferente do Playback ID — encontra-o na mesma página
   * do asset no dashboard). Só é preciso para correres os scripts que
   * anexam legendas e faixas de áudio (ver scripts/mux-add-track.mjs).
   * Não é usado pelo site em si.
   */
  assetId?: string;
  /**
   * Registo informativo dos idiomas já anexados a este título via
   * `scripts/mux-add-track.mjs`. O leitor não lê esta lista — o Mux
   * Player mostra os menus de legendas/áudio automaticamente a partir do
   * stream assim que os anexares. Serve só para saberes, ao olhar para
   * este ficheiro, o que já foi feito para cada título.
   */
  subtitles?: TrackInfo[];
  audioTracks?: TrackInfo[];
};

export type Episode = {
  /** Identificador usado no URL do episódio, ex: 1 */
  episodeNumber: number;
  title: string;
  synopsis?: string;
  duration?: string;
  /** Playback ID do asset no Mux para este episódio. Deixa "" se ainda não tiveres o vídeo. */
  playbackId: string;
};

export type Season = {
  seasonNumber: number;
  /** Título opcional a mostrar em vez de "Temporada N". */
  title?: string;
  episodes: Episode[];
};

export type Show = BaseItem & {
  kind: "show";
  seasons: Season[];
};

export type CatalogItem = Movie | Show;

// ---------------------------------------------------------------------------
// CATÁLOGO — substitui estas entradas pelos teus títulos reais.
//
// Filmes (kind: "movie"):
//  1. Faz upload do vídeo ao Mux e copia o "Playback ID" do asset.
//  2. Cola-o em `playbackId`.
//
// Séries (kind: "show"):
//  1. Organiza os episódios em `seasons` -> `episodes`.
//  2. Cada episódio tem o seu próprio `playbackId` (é um asset separado no
//     Mux, tal como um filme).
//
// Em ambos: (Opcional) adiciona `poster` (retrato, ideal 780x1170) e
// `backdrop` (paisagem, ideal 1920x1080). Podes colocar as imagens em
// public/posters/ e public/backdrops/.
//
// O primeiro título com `featured: true` é usado no ecrã principal.
// ---------------------------------------------------------------------------

export const catalog: CatalogItem[] = [
  {
    kind: "movie",
    slug: "nevoa-alta",
    title: "Névoa Alta",
    synopsis:
      "Numa vila piscatória do norte, uma engenheira regressa a casa para investigar a morte do pai e descobre uma rede de segredos escondida sob o cais antigo.",
    year: 2024,
    duration: "1h 47m",
    genre: "Drama",
    playbackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe",
    assetId: "", // cola aqui o Asset ID (ver README) quando fores anexar legendas/áudio
    // Exemplo de preenchimento depois de correres o script para este título:
    // subtitles: [{ lang: "pt", name: "Português" }, { lang: "en", name: "English" }],
    // audioTracks: [{ lang: "en", name: "English" }],
    featured: true,
  },
  {
    kind: "movie",
    slug: "linha-de-fuga",
    title: "Linha de Fuga",
    synopsis:
      "Um piloto de rali reformado é arrastado de volta às pistas quando o filho desaparece na véspera da corrida mais perigosa da sua carreira.",
    year: 2023,
    duration: "1h 58m",
    genre: "Ação",
    playbackId: "",
  },
  {
    kind: "movie",
    slug: "sala-27",
    title: "Sala 27",
    synopsis:
      "Uma investigação a um hospital abandonado revela mais do que documentos perdidos — revela porque é que ninguém que lá entra à noite volta a falar sobre isso.",
    year: 2022,
    duration: "1h 34m",
    genre: "Suspense",
    playbackId: "",
  },
  {
    kind: "movie",
    slug: "aguas-de-marco",
    title: "Águas de Março",
    synopsis:
      "Três gerações de mulheres da mesma família reencontram-se numa casa de campo para decidir o que fazer com a herança — e com o silêncio que as separa.",
    year: 2021,
    duration: "2h 05m",
    genre: "Drama",
    playbackId: "",
  },
  {
    kind: "movie",
    slug: "o-ultimo-turno",
    title: "O Último Turno",
    synopsis:
      "Numa refinaria à beira do encerramento, um grupo de operários planeia um último golpe antes que as máquinas parem para sempre.",
    year: 2020,
    duration: "1h 51m",
    genre: "Thriller",
    playbackId: "",
  },
  {
    kind: "movie",
    slug: "constelacao",
    title: "Constelação",
    synopsis:
      "Um documentário sobre os últimos observatórios analógicos da Europa e as pessoas que insistem em olhar para o céu à moda antiga.",
    year: 2024,
    duration: "1h 12m",
    genre: "Documentário",
    playbackId: "",
  },
  {
    kind: "show",
    slug: "sombras-da-cidade",
    title: "Sombras da Cidade",
    synopsis:
      "Uma detetive recém-transferida para a esquadra do porto descobre que o caso mais simples da sua carreira esconde uma teia de favores políticos com décadas.",
    year: 2024,
    genre: "Drama policial",
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: "Chegada",
            synopsis: "A detetive Marta Soares chega ao porto e recebe o primeiro caso.",
            duration: "48m",
            playbackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe",
          },
          {
            episodeNumber: 2,
            title: "O Armazém",
            synopsis: "Uma pista leva Marta a um armazém abandonado junto às docas.",
            duration: "45m",
            playbackId: "",
          },
          {
            episodeNumber: 3,
            title: "Nomes Antigos",
            synopsis: "Velhos conhecidos da família Soares voltam a cruzar-se no caso.",
            duration: "51m",
            playbackId: "",
          },
        ],
      },
      {
        seasonNumber: 2,
        episodes: [
          {
            episodeNumber: 1,
            title: "Um Ano Depois",
            synopsis: "Marta regressa ao porto depois de um ano afastada do caso.",
            duration: "47m",
            playbackId: "",
          },
        ],
      },
    ],
  },
];

export function getItemBySlug(slug: string): CatalogItem | undefined {
  return catalog.find((item) => item.slug === slug);
}

export function getFeaturedItem(): CatalogItem {
  return catalog.find((item) => item.featured) ?? catalog[0];
}

export function isMovie(item: CatalogItem): item is Movie {
  return item.kind === "movie";
}

export function isShow(item: CatalogItem): item is Show {
  return item.kind === "show";
}

/** Se o título já tem pelo menos um vídeo pronto a reproduzir. */
export function hasPlayableVideo(item: CatalogItem): boolean {
  if (item.kind === "movie") return Boolean(item.playbackId);
  return item.seasons.some((season) =>
    season.episodes.some((ep) => Boolean(ep.playbackId))
  );
}

/** Etiquetas curtas (ano, género, duração/episódios) para mostrar em chips. */
export function getMetaChips(item: CatalogItem): string[] {
  const chips = [String(item.year), item.genre];
  if (item.kind === "movie") {
    chips.push(item.duration);
    return chips;
  }
  const seasons = item.seasons.length;
  const episodes = item.seasons.reduce((n, s) => n + s.episodes.length, 0);
  chips.push(`${seasons} ${seasons === 1 ? "temporada" : "temporadas"}`);
  chips.push(`${episodes} ${episodes === 1 ? "episódio" : "episódios"}`);
  return chips;
}

/** Segmento usado no URL do player para um episódio, ex: "1-3". */
export function episodeRouteSegment(seasonNumber: number, episodeNumber: number) {
  return `${seasonNumber}-${episodeNumber}`;
}

export function parseEpisodeSegment(
  segment: string
): { season: number; episode: number } | null {
  const match = /^(\d+)-(\d+)$/.exec(segment);
  if (!match) return null;
  return { season: Number(match[1]), episode: Number(match[2]) };
}

export function findEpisode(
  show: Show,
  seasonNumber: number,
  episodeNumber: number
): Episode | undefined {
  const season = show.seasons.find((s) => s.seasonNumber === seasonNumber);
  return season?.episodes.find((e) => e.episodeNumber === episodeNumber);
}

export function getNextEpisode(
  show: Show,
  seasonNumber: number,
  episodeNumber: number
): { seasonNumber: number; episode: Episode } | null {
  const seasonIdx = show.seasons.findIndex((s) => s.seasonNumber === seasonNumber);
  if (seasonIdx === -1) return null;

  const season = show.seasons[seasonIdx];
  const epIdx = season.episodes.findIndex((e) => e.episodeNumber === episodeNumber);
  if (epIdx !== -1 && epIdx + 1 < season.episodes.length) {
    return { seasonNumber, episode: season.episodes[epIdx + 1] };
  }

  const nextSeason = show.seasons[seasonIdx + 1];
  if (nextSeason && nextSeason.episodes.length > 0) {
    return { seasonNumber: nextSeason.seasonNumber, episode: nextSeason.episodes[0] };
  }
  return null;
}

/** URL de reprodução principal para um item (primeiro episódio disponível, no caso de séries). */
export function getPrimaryWatchHref(item: CatalogItem): string | null {
  if (item.kind === "movie") {
    return item.playbackId ? `/titulo/${item.slug}/reproduzir` : null;
  }
  for (const season of item.seasons) {
    for (const ep of season.episodes) {
      if (ep.playbackId) {
        return `/titulo/${item.slug}/reproduzir/${episodeRouteSegment(season.seasonNumber, ep.episodeNumber)}`;
      }
    }
  }
  return null;
}
