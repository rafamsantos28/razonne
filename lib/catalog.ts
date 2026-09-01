/** Um idioma de legendas ou de áudio já anexado ao asset no Mux. */
export type TrackInfo = {
  /** Código de idioma BCP-47, ex: "pt", "en", "es". */
  lang: string;
  /** Nome mostrado no menu do leitor, ex: "Português". */
  name: string;
};

export type Title = {
  /** Identificador usado no URL, ex: /titulo/nevoa-alta */
  slug: string;
  title: string;
  synopsis: string;
  year: number;
  duration: string; // ex: "1h 42m"
  genre: string;
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
  /**
   * Caminhos opcionais para imagens reais (podes pôr em /public/posters/...
   * ou uma URL https completa). Se ficarem por preencher, o site desenha
   * automaticamente uma capa gerada com as cores da marca.
   */
  poster?: string;
  backdrop?: string;
  featured?: boolean;
};

// ---------------------------------------------------------------------------
// CATÁLOGO — substitui estas entradas pelos teus títulos reais.
//
// Para cada título:
//  1. Faz upload do vídeo ao Mux e copia o "Playback ID" do asset.
//  2. Cola-o em `playbackId`.
//  3. (Opcional) adiciona `poster` (retrato, ideal 780x1170) e `backdrop`
//     (paisagem, ideal 1920x1080). Podes colocar as imagens em /public.
//
// O primeiro título com `featured: true` é usado no ecrã principal.
// ---------------------------------------------------------------------------

export const catalog: Title[] = [
  {
    slug: "leviticus",
    title: "Leviticus",
    synopsis:
      "Ambientada numa comunidade cristã rural, isolada e extremamente conservadora no interior de Victoria, na Austrália, a história acompanha dois rapazes adolescentes, Naim e Ryan.",
    year: 2026,
    duration: "1h 28m",
    genre: "Terror",
    playbackId: "ZmsJPxap2jtAreJueY00ClpLAOQfqummDoFaR02001blsA",
    assetId: "51MVjg8rvwn01pTPEcwtR7e6hSKk6of3701WoN6qvtmiM", // cola aqui o Asset ID (ver README) quando fores anexar legendas/áudio
    // Exemplo de preenchimento depois de correres o script para este título:
    // subtitles: [{ lang: "pt", name: "Português" }, { lang: "en", name: "English" }],
    // audioTracks: [{ lang: "en", name: "English" }],
    featured: true,
  },
  {
    slug: "minimos-e-monstros",
    title: "Mínimos e Monstros",
    synopsis:
      "Os Mínimos são uma comunidade de incontáveis (e tresloucados) seres pequeninos, amarelos e em forma de comprimido. Algo hiperactivos, são dotados de um humor só comparável à sua enorme tendência para tropelias.",
    year: 2026,
    duration: "1h 32m",
    genre: "Animação",
    playbackId: "No7024O54AavSSzfnJQf1MVfa01Kju9BojUiJdNe7kKF4",
  },
  {
    slug: "toy-story-5",
    title: "Toy Story 5",
    synopsis:
      "Passados mais de 30 anos sobre a estreia de "Toy Story - Os Rivais", a história que se tornou um marco na vida de milhões de espectadores por todo o mundo continua neste quinto capítulo.",
    year: 2026,
    duration: "1h 40m",
    genre: "Animação",
    playbackId: "1xZeRIacR6jdUHxMKcYTQz7AjqAQId14Bl01coVV6yxs",
  },
  {
    slug: "scary-movie-whats-up",
    title: "Scary Movie: What's Up",
    synopsis:
      "Vinte e seis anos depois de terem sobrevivido a uma série de ataques cometidos por um implacável assassino mascarado, Cindy, Brenda, Shorty e Ray deparam-se com uma nova vaga de violência.Três gerações de mulheres da mesma família reencontram-se numa casa de campo para decidir o que fazer com a herança — e com o silêncio que as separa.",
    year: 2026,
    duration: "1h 35m",
    genre: "Comédia",
    playbackId: "WJJTca8WbxJR42eu1DTN023zGeoTiMKF01TZ4GHIgVPZo",
  },
  {
    slug: "evil-dead-burn",
    title: "Evil Dead Burn",
    synopsis:
      "Após a morte do marido, Alice aceita o convite para passar alguns dias em casa dos sogros.",
    year: 2026,
    duration: "1h 50m",
    genre: "Terror",
    playbackId: "49hkoOpsGMKUim1a6DXdfNjIii1cD02OfaCVpGXPwN8M",
  },
  {
    slug: "jackass-ultimo-shot-de-loucura",
    title: "Jackass: Último Shot de Loucura",
    synopsis:
      "Depois do enorme sucesso da série lançada no ano 2000 no canal MTV, Johnny Knoxville, Steve-O, Chris Pontius, Wee Man e o restante grupo de Jackass regressam para mais uma – que afirmam ser a última – ronda de acrobacias, quedas, embates e situações capazes de fazer gelar o sangue dos mais audazes.",
    year: 2026,
    duration: "1h 35m",
    genre: "Comédia",
    playbackId: "j2HP9dGKJQzZgwUCT009eOIORvvyWdOhMQn7Z3UAJlQg",
  },
];

export function getTitleBySlug(slug: string): Title | undefined {
  return catalog.find((t) => t.slug === slug);
}

export function getFeaturedTitle(): Title {
  return catalog.find((t) => t.featured) ?? catalog[0];
}
