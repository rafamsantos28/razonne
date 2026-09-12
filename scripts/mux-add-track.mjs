#!/usr/bin/env node
/**
 * Anexa uma faixa de legendas (.vtt) ou de áudio dobrado (.mp3/.m4a/.wav) a
 * um asset já existente no Mux, usando a API oficial de "asset tracks".
 *
 * Corre uma vez por cada ficheiro que quiseres anexar. Depois de processado
 * (normalmente segundos a poucos minutos), o Mux Player no site já mostra
 * o idioma novo sozinho, sem precisares de mexer em código.
 *
 * Precisa de MUX_TOKEN_ID e MUX_TOKEN_SECRET num ficheiro .env.local
 * (ver .env.example) — nunca cometas essas chaves no Git.
 *
 * ---------------------------------------------------------------------
 * Legendas (subtitles):
 *   node scripts/mux-add-track.mjs \
 *     --asset SEU_ASSET_ID \
 *     --type text \
 *     --lang en \
 *     --name "English" \
 *     --url https://razonneplus.pt/legendas/nevoa-alta-en.vtt
 *
 * Faixa de áudio dobrado (dub):
 *   node scripts/mux-add-track.mjs \
 *     --asset SEU_ASSET_ID \
 *     --type audio \
 *     --lang en \
 *     --name "English" \
 *     --url https://razonneplus.pt/audio/nevoa-alta-en.mp3
 * ---------------------------------------------------------------------
 */

import "dotenv/config";

const TOKEN_ID = process.env.MUX_TOKEN_ID;
const TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

function fail(message) {
  console.error(`\nErro: ${message}\n`);
  process.exit(1);
}

if (!TOKEN_ID || !TOKEN_SECRET) {
  fail(
    "Faltam MUX_TOKEN_ID / MUX_TOKEN_SECRET. Copia .env.example para .env.local e preenche com as credenciais da API do Mux (dashboard → Settings → API Access Tokens)."
  );
}

const assetId = arg("asset");
const type = arg("type"); // "text" | "audio"
const url = arg("url");
const lang = arg("lang");
const name = arg("name");
const closedCaptions = process.argv.includes("--closed-captions");

if (!assetId || !type || !url || !lang) {
  fail(
    "Faltam argumentos. Exemplo:\n  node scripts/mux-add-track.mjs --asset ASSET_ID --type text --lang pt --name \"Português\" --url https://.../ficheiro.vtt"
  );
}

if (type !== "text" && type !== "audio") {
  fail('--type tem de ser "text" (legendas) ou "audio" (faixa de áudio).');
}

const body =
  type === "text"
    ? {
        url,
        type: "text",
        text_type: "subtitles",
        closed_captions: closedCaptions,
        language_code: lang,
        name: name ?? lang,
      }
    : {
        url,
        type: "audio",
        language_code: lang,
        name: name ?? lang,
      };

const auth = Buffer.from(`${TOKEN_ID}:${TOKEN_SECRET}`).toString("base64");

const res = await fetch(
  `https://api.mux.com/video/v1/assets/${assetId}/tracks`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  }
);

const data = await res.json();

if (!res.ok) {
  console.error("\nO Mux recusou o pedido:\n", JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(
  `\nFaixa "${name ?? lang}" (${type}, ${lang}) adicionada com sucesso ao asset ${assetId}.`
);
console.log("Estado inicial:", data.data?.status ?? "a processar");
console.log(
  "\nAssim que o estado passar a 'ready' (podes confirmar no dashboard do Mux), o idioma aparece automaticamente no menu do Mux Player no site."
);
