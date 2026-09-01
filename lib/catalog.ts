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
    slug: "constelacao",
    title: "Constelação",
    synopsis:
      "Um documentário sobre os últimos observatórios analógicos da Europa e as pessoas que insistem em olhar para o céu à moda antiga.",
    year: 2024,
    duration: "1h 12m",
    genre: "Documentário",
    playbackId: "",
  },
];

export function getTitleBySlug(slug: string): Title | undefined {
  return catalog.find((t) => t.slug === slug);
}

export function getFeaturedTitle(): Title {
  return catalog.find((t) => t.featured) ?? catalog[0];
}
