/**
 * Extracts @username mentions from text string.
 */
export function extractMentions(text: string): string[] {
  if (!text) return [];
  const regex = /@([a-zA-Z0-9._-]+)/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      matches.push(match[1]);
    }
  }

  return Array.from(new Set(matches));
}
