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
    slug: "super-mario-galaxy-o-filme",
    title: "Super Mario Galaxy: O Filme",
    synopsis:
      "Depois de salvarem o Reino dos Cogumelos, onde agora residem, Mario e Luigi — os simpáticos canalizadores de Brooklyn de ascendência italiana — vêem-se a braços com uma luta intergaláctica.",
    year: 2026,
    duration: "1h 38m",
    genre: "Animação",
    poster: "/posters/super-mario-galaxy-o-filme.jpg",
    backdrop: "/backdrops/super-mario-galaxy-o-filme.jpg",
    playbackId: "00dZfYVbjtOSBMO4RqTVfjUZk53lrbZhKb2r3ZXnLITk",
    assetId: "Ck00GRxgj119R15wglt324U6eO9ZWy4ce9dOrxF00mcM4", // cola aqui o Asset ID (ver README) quando fores anexar legendas/áudio
    // Exemplo de preenchimento depois de correres o script para este título:
    // subtitles: [{ lang: "pt", name: "Português" }, { lang: "en", name: "English" }],
    // audioTracks: [{ lang: "en", name: "English" }],
    featured: true,
  },
  {
    kind: "movie",
    slug: "leviticus",
    title: "Leviticus",
    synopsis:
      "Acompanha dois adolescentes numa comunidade rural isolada que fogem de uma entidade sobrenatural violenta após um ritual de conversão religiosa falhado.",
    year: 2026,
    duration: "1h 28m",
    genre: "Terror",
    poster: "/posters/leviticus.jpg",
    backdrop: "/backdrops/leviticus.jpg",
    playbackId: "ZmsJPxap2jtAreJueY00ClpLAOQfqummDoFaR02001blsA",
  },
  {
    kind: "movie",
    slug: "michael",
    title: "Michael",
    synopsis:
      "Com Jaafar Jackson, sobrinho de Michael Jackson​, a dar vida ao protagonista, o filme acompanha o percurso artístico e pessoal do artista, atravessando o contexto familiar que o fez entrar na indústria musical com apenas cinco anos de idade, a ascensão meteórica ao lado dos The Jackson 5 e o seu esforço de continuar numa carreira a solo, sempre marcada por um excesso de exposição mediática.",
    year: 2026,
    duration: "2h 08m",
    genre: "Biografia",
    poster: "/posters/michael.jpg",
    backdrop: "backdrops/michael.jpg",
    playbackId: "wW01Hwwx95ZhzCVjf8ofWQ3OWcdIDWOQcjFD5uw3jAyg",
  },
  {
    kind: "movie",
    slug: "ladroes-da-treta",
    title: "Ladrões da Treta",
    synopsis:
      "Frustrado por, mais uma vez, não ver o seu valor reconhecido com uma promoção, Stan resolve deitar tudo a perder e roubar do cofre do chefe uma mala com um milhão de euros, dinheiro obtido de forma dúbia.",
    year: 2025,
    duration: "1h 30m",
    genre: "Comédia",
    poster: "/posters/ladroes-da-treta.jpg",
    backdrop: "/backdrops/ladroes-da-treta.jpg",
    playbackId: "5I2noHm32e7qR53CRq2ICQ9y01N1Q01i767GqWPL7GTUM",
  },
  {
    kind: "movie",
    slug: "minimos-e-monstros",
    title: "Mínimos e Monstros",
    synopsis:
      "Os Mínimos são uma comunidade de incontáveis (e tresloucados) seres pequeninos, amarelos e em forma de comprimido.",
    year: 2026,
    duration: "1h 32m",
    genre: "Animação",
    poster: "/posters/minomos-e-monstros.jpg",
    backdrop: "/backdrops/minimos-e-monstros.jpg",
    playbackId: "No7024O54AavSSzfnJQf1MVfa01Kju9BojUiJdNe7kKF4",
  },
  {
    kind: "movie",
    slug: "toy-story-5",
    title: "Toy Story 5",
    synopsis:
      "Passados mais de 30 anos sobre a estreia de Toy Story Os Rivais, a história que se tornou um marco na vida de milhões de espectadores por todo o mundo continua neste quinto capítulo.",
    year: 2026,
    duration: "1h 40m",
    genre: "Animação",
    poster: "/posters/toy-story-5.jpg",
    backdrop: "/backdrops/toy-story-5.jpg",
    playbackId: "1xZeRIacR6jdUHxMKcYTQz7AjqAQId14Bl01coVV6yxs",
  },
  {
    kind: "movie",
    slug: "scary-movie-whats-up",
    title: "Scary Movie: What's Up",
    synopsis:
      "Vinte e seis anos depois de terem sobrevivido a uma série de ataques cometidos por um implacável assassino mascarado, Cindy, Brenda, Shorty e Ray deparam-se com uma nova vaga de violência.",
    year: 2026,
    duration: "1h 35m",
    genre: "Comédia",
    poster: "/posters/scary-movie-whats-up.jpg",
    backdrop: "/backdrops/scary-movie-whats-up.jpg",
    playbackId: "WJJTca8WbxJR42eu1DTN023zGeoTiMKF01TZ4GHIgVPZo",
  },
  {
    kind: "show",
    slug: "shin-chan",
    title: "Shin Chan",
    synopsis:
      "Uma detetive recém-transferida para a esquadra do porto descobre que o caso mais simples da sua carreira esconde uma teia de favores políticos com décadas.",
    year: 2006,
    genre: "Animação",
    poster: "/posters/shin-chan.jpg",
    backdrop: "/backdrops/shin-chan.jpg",
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: "Shin Chan vai às compras / Olha-me este desenho",
            synopsis: "A detetive Marta Soares chega ao porto e recebe o primeiro caso.",
            duration: "22m",
            playbackId: "SdLLgTif9iZHyge6iOao2w00lh01PsL01sd2HCNKF6dMLM",
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
