import type { CatalogItem } from "./catalog";

/**
 * Pesquisa "fuzzy" sobre o catálogo: tolera pequenos erros ortográficos
 * (letras trocadas, em falta ou a mais) e, quando não há nenhum título com
 * esse nome exato, devolve os títulos mais parecidos com o que foi escrito,
 * em vez de uma lista vazia.
 *
 * Não usa nenhuma dependência externa — só distância de Levenshtein simples,
 * que chega perfeitamente para um catálogo deste tamanho.
 */

/** Remove acentos, pontuação e normaliza para minúsculas. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacríticos (á -> a, ç -> c, etc.)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Distância de Levenshtein clássica (nº mínimo de edições entre duas strings). */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previousRow = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 0; i < a.length; i++) {
    const currentRow: number[] = [i + 1];
    for (let j = 0; j < b.length; j++) {
      const insertCost = currentRow[j] + 1;
      const deleteCost = previousRow[j + 1] + 1;
      const substituteCost = previousRow[j] + (a[i] === b[j] ? 0 : 1);
      currentRow.push(Math.min(insertCost, deleteCost, substituteCost));
    }
    previousRow = currentRow;
  }

  return previousRow[b.length];
}

/** Distância normalizada entre 0 (idêntico) e 1 (nada a ver). */
function normalizedDistance(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 0;
  return levenshtein(a, b) / maxLen;
}

/** Melhor (menor) distância entre a query e cada palavra do título. */
function bestWordDistance(query: string, title: string): number {
  const words = title.split(" ").filter(Boolean);
  if (words.length === 0) return 1;
  let best = Infinity;
  for (const word of words) {
    best = Math.min(best, normalizedDistance(query, word));
  }
  return best;
}

export type SearchMatch = {
  item: CatalogItem;
  /** 0 = correspondência perfeita, quanto maior, mais "afastado". */
  score: number;
  /** true se o título contém a pesquisa tal como foi escrita. */
  exact: boolean;
};

const GOOD_MATCH_THRESHOLD = 0.42;

/**
 * Pesquisa no catálogo. Devolve sempre os resultados ordenados do mais para
 * o menos relevante. Quando `query` está vazia, devolve todo o catálogo.
 */
export function searchCatalog(catalog: CatalogItem[], rawQuery: string): SearchMatch[] {
  const query = normalize(rawQuery);

  if (!query) {
    return catalog.map((item) => ({ item, score: 0, exact: true }));
  }

  const matches: SearchMatch[] = catalog.map((item) => {
    const title = normalize(item.title);
    const genre = normalize(item.genre);

    // Correspondência direta (substring) — o caso mais comum e mais forte.
    if (title.includes(query)) {
      const exact = title === query;
      // Título que começa com a pesquisa conta como melhor do que uma
      // ocorrência a meio do título.
      const startBonus = title.startsWith(query) ? 0 : 0.05;
      return { item, score: exact ? 0 : startBonus, exact: title.startsWith(query) };
    }

    // Tolerância a erros ortográficos: compara com o título inteiro e com
    // cada palavra individual (para "vngadores" encontrar "Vingadores" em
    // "Os Vingadores", por exemplo).
    const wholeTitleDistance = normalizedDistance(query, title);
    const perWordDistance = bestWordDistance(query, title);
    const genreDistance = genre.includes(query) ? 0.3 : 1;

    const score = Math.min(wholeTitleDistance, perWordDistance, genreDistance);
    return { item, score, exact: false };
  });

  matches.sort((a, b) => a.score - b.score);
  return matches;
}

/** Só os resultados que consideramos uma correspondência razoável. */
export function goodMatches(matches: SearchMatch[]): SearchMatch[] {
  return matches.filter((m) => m.score <= GOOD_MATCH_THRESHOLD);
}

export { GOOD_MATCH_THRESHOLD };
