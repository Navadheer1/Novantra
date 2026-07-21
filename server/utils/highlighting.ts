/**
 * Highlight Utility for Noventra Universal Search
 * Provides snippet extraction and match term offset calculation for UI rendering.
 */

export interface HighlightMatch {
  field: string;
  snippet: string;
  matchIndexes: Array<[number, number]>;
}

/**
 * Extracts a concise text snippet surrounding the first match of the query term.
 */
export function extractSnippet(text: string, query: string, maxLength = 120): string {
  if (!text || !query) return text ? text.slice(0, maxLength) : '';

  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + query.length + 60);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

/**
 * Generates match metadata for a specific field
 */
export function getHighlights(text: string | null | undefined, query: string, fieldName: string): HighlightMatch | null {
  if (!text || !query) return null;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndexes: Array<[number, number]> = [];

  let startPos = 0;
  while (startPos < lowerText.length) {
    const idx = lowerText.indexOf(lowerQuery, startPos);
    if (idx === -1) break;
    matchIndexes.push([idx, idx + lowerQuery.length]);
    startPos = idx + lowerQuery.length;
  }

  if (matchIndexes.length === 0) return null;

  return {
    field: fieldName,
    snippet: extractSnippet(text, query),
    matchIndexes
  };
}
