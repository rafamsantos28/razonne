# Razonne+

Site de streaming on-demand da Razonne+, construído em Next.js (App Router) e
com reprodução de vídeo através do **Mux Player**. Vídeos hospedados no Mux,
site pronto para deploy na Vercel com o domínio `razonneplus.pt`.

## Estrutura

- `/` — página inicial, com destaque (hero) e grelha de catálogo.
- `/titulo/[slug]` — página de detalhes de um título (sinopse, ano, género,
  duração). O título do filme aparece na aba do browser.
- `/titulo/[slug]/reproduzir` — página do leitor, com o Mux Player a ecrã
  inteiro.

Todo o catálogo vive num único ficheiro: **`lib/catalog.ts`**.

## Como adicionar os teus filmes

Abre `lib/catalog.ts` e edita (ou acrescenta) entradas:

```ts
{
  slug: "o-teu-filme",              // usado no URL: /titulo/o-teu-filme
  title: "O Teu Filme",
  synopsis: "Sinopse curta do filme.",
  year: 2024,
  duration: "1h 40m",
  genre: "Drama",
  playbackId: "COLA_AQUI_O_PLAYBACK_ID_DO_MUX",
  poster: "/posters/o-teu-filme.jpg",     // opcional
  backdrop: "/backdrops/o-teu-filme.jpg", // opcional
  featured: true,                          // opcional: destaque na home
}
```

Para obteres o `playbackId`: no [dashboard do Mux](https://dashboard.mux.com),
abre o asset já carregado → separador **Playback IDs** → copia o ID (é
suposto ser `public` para funcionar sem assinatura de tokens).

Se não definires `poster`/`backdrop`, o site desenha automaticamente uma capa
com o gradiente da marca — por isso o catálogo nunca fica "vazio" enquanto
não tens as imagens finais. Basta colocares os ficheiros em `public/posters/`
e apontar o caminho (ex: `/posters/ficheiro.jpg`).

### Onde colocar os posters (retrato) e banners (paisagem)

| Imagem | Onde usar no site | Pasta | Proporção ideal | Tamanho recomendado |
|---|---|---|---|---|
| **Poster** | Cartão do catálogo e miniatura na página de detalhes | `public/posters/` | 2:3 (vertical) | ~780 × 1170 px |
| **Banner / backdrop** | Fundo do destaque (hero) na home e topo da página de detalhes | `public/backdrops/` | 16:9 (horizontal) | ~1920 × 1080 px |

Passos:

1. Exporta as imagens em `.jpg` ou `.webp` (webp fica mais leve).
2. Copia-as para `public/posters/nome-do-filme.jpg` e
   `public/backdrops/nome-do-filme.jpg`.
3. Em `lib/catalog.ts`, no título correspondente:
   ```ts
   poster: "/posters/nome-do-filme.jpg",
   backdrop: "/backdrops/nome-do-filme.jpg",
   ```
4. Faz deploy (ou `git push`, se já estiver ligado à Vercel).

Não precisas de otimizar manualmente o peso do ficheiro — o Next.js
redimensiona e comprime estas imagens automaticamente quando o site está
na Vercel, através do `next/image`. Ainda assim, evita ficheiros gigantes
(um poster não precisa de pesar mais do que ~500 KB à partida).

Também podes usar uma URL `https://` completa em vez de um ficheiro local
(por exemplo se preferires guardar as imagens noutro sítio, como um
bucket ou um CMS) — funciona da mesma forma, só que sem passar por
`public/`.

**Atalho para o banner:** se um título já tiver vídeo no Mux, o Mux gera
automaticamente uma imagem a partir de um frame do próprio vídeo, sem
precisares de preparar nada à parte:
```
backdrop: "https://image.mux.com/PLAYBACK_ID/thumbnail.jpg?time=12"
```
(o `time=12` escolhe o segundo 12 do vídeo como frame; ajusta até
encontrares um bom enquadramento). Isto já está preparado no
`next.config.mjs`. Para o poster propriamente dito (arte promocional,
normalmente vertical e com o título desenhado), o mais comum é mesmo
usares uma imagem própria em `public/posters/`.

Um título sem `playbackId` aparece marcado como "Em breve" no catálogo e a
página de reprodução mostra uma mensagem em vez de tentar carregar vídeo.

## Legendas e áudio em vários idiomas

O Mux Player já sabe mostrar um menu de legendas ("CC") e um menu de idioma
de áudio sozinho — mas só quando as faixas fazem parte do stream do
próprio asset no Mux. Não é possível simplesmente "carregar" um `.vtt` ou
`.mp3` no código do leitor (o Mux Player não suporta ficheiros de legendas
externos ao stream); tens de anexar cada ficheiro ao asset através da API
do Mux. Uma vez anexado, não precisas de tocar em nenhum código — o
`Player.tsx` já está pronto para mostrar tudo o que o stream trouxer.

### Onde hospedar os ficheiros .mp3 e .vtt

O Mux só precisa de conseguir **descarregar** o ficheiro uma vez, através
de um URL público em HTTPS — depois disso, o ficheiro fica guardado e
processado do lado do Mux, e a origem deixa de importar para a reprodução.
A forma mais simples, sem contratares mais nenhum serviço, é usares este
mesmo projeto:

1. Coloca os ficheiros em `public/legendas/` (para `.vtt`) e
   `public/audio/` (para `.mp3`/`.m4a`/`.wav`) — já criei estas pastas.
2. Faz deploy (ou `git push`, se já estiver ligado à Vercel).
3. O ficheiro fica acessível em, por exemplo:
   `https://razonneplus.pt/legendas/nevoa-alta-en.vtt`
   `https://razonneplus.pt/audio/nevoa-alta-en.mp3`
4. Usa esse URL no script abaixo.

Alternativas igualmente válidas, se preferires não misturar estes
ficheiros com o código do site: um bucket S3, Cloudflare R2, Backblaze B2
ou Vercel Blob com leitura pública. O processo com o script é exatamente
o mesmo — só muda o URL.

### Formato dos ficheiros

- **Legendas**: WebVTT (`.vtt`). Um ficheiro por idioma.
- **Áudio dobrado**: `.mp3`, `.m4a` ou `.wav`, com a mesma duração/tempos
  do vídeo original (sem desfasamento), um ficheiro por idioma.

### Anexar uma faixa

1. Vai ao [dashboard do Mux](https://dashboard.mux.com) → o asset em
   questão → copia o **Asset ID** (não é o Playback ID) e cola-o em
   `assetId` desse título em `lib/catalog.ts`, só para referência tua.
2. Cria um token de API em **Settings → API Access Tokens** com
   permissão de escrita em Mux Video, e copia `MUX_TOKEN_ID` e
   `MUX_TOKEN_SECRET` para um ficheiro `.env.local` (parte de
   `.env.example`).
3. Corre o script, uma vez por ficheiro:

```bash
# Legendas em inglês
npm run add-track -- \
  --asset SEU_ASSET_ID \
  --type text \
  --lang en \
  --name "English" \
  --url https://razonneplus.pt/legendas/nevoa-alta-en.vtt

# Áudio dobrado em inglês
npm run add-track -- \
  --asset SEU_ASSET_ID \
  --type audio \
  --lang en \
  --name "English" \
  --url https://razonneplus.pt/audio/nevoa-alta-en.mp3
```

Passado uns segundos a minutos (o Mux processa em segundo plano), a
faixa fica pronta e aparece sozinha nos menus do leitor, sem precisares
de fazer novo deploy. Podes correr o script para quantos idiomas
quiseres — cada chamada acrescenta mais uma opção ao menu respetivo.

Por fim, atualiza (opcionalmente, só para memória futura) o campo
`subtitles`/`audioTracks` desse título em `lib/catalog.ts`, para saberes
de relance o que já está feito.

## Correr localmente

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Deploy na Vercel com o domínio razonneplus.pt

1. Sobe este projeto para um repositório Git (GitHub/GitLab/Bitbucket).
2. Em [vercel.com/new](https://vercel.com/new), importa o repositório —
   a Vercel deteta automaticamente que é um projeto Next.js, não precisas de
   configurar nada.
3. Depois do primeiro deploy, vai a **Project → Settings → Domains** e
   adiciona `razonneplus.pt` (e `www.razonneplus.pt`, se quiseres o redirect).
4. No painel do teu registador de domínio, aponta:
   - registo **A** de `razonneplus.pt` para `76.76.21.21`, ou
   - regista `razonneplus.pt` como **CNAME**/ALIAS conforme a Vercel indicar
     na própria página de Domains (o valor exato aparece ali, com um botão
     de "verificar" que confirma quando propagar).
5. A Vercel emite o certificado HTTPS automaticamente assim que o DNS
   propagar.

Não há variáveis de ambiente obrigatórias — o Mux Player consome
diretamente o `playbackId` público de cada asset, sem chave de API no
browser.

### Vídeos privados/assinados (opcional, para mais tarde)

Se um dia quiseres impedir a reprodução direta do URL do Mux (playback
policy `signed` em vez de `public`), precisas de gerar tokens assinados no
servidor. Isso implica criar uma rota de API em `app/api/mux-token/route.ts`
que use a tua chave privada do Mux (via variável de ambiente na Vercel) para
assinar um JWT por pedido, e passar esse token à prop `tokens` do
`<MuxPlayer>`. O catálogo atual assume playback IDs públicos, que é
suficiente para a maioria dos casos de uso "básico" como este.
