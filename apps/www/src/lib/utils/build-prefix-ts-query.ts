/**
 * Build a PostgreSQL full-text search query string for prefix matching
 * from the given input string.
 * @param input - The input string to convert into a tsquery.
 * @returns A tsquery string suitable for use with to_tsquery, or null if no valid tokens.
 */
export function buildPrefixTsQuery(input: string) {
  // normalize, remove punctuation, split into tokens
  const tokens = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ") // keep unicode letters/numbers & spaces
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    // optional: drop very short tokens (single letters / stop-words)
    .filter((t) => t.length > 1)

  if (tokens.length === 0) return null

  // append :* for prefix-match and join with & (AND)
  // e.g. ['optimum', 'creati'] -> 'optimum:* & creati:*'
  return tokens.map((t) => `${t}:*`).join(" & ")
}
