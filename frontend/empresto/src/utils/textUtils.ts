const LOWERCASE_WORDS = new Set([
  'a', 'o', 'as', 'os',
  'um', 'uma', 'uns', 'umas',
  'de', 'do', 'da', 'dos', 'das',
  'em', 'no', 'na', 'nos', 'nas',
  'por', 'pelo', 'pela', 'pelos', 'pelas',
  'para', 'pra', 'pro', 'pras', 'pros',
  'com', 'sem', 'sob', 'sobre',
  'ao', 'aos', 'à', 'às',
  'e', 'ou', 'mas', 'que', 'se',
]);

const ROMAN_NUMERALS = new Set([
  'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
  'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
]);

export function formatTitleCase(input: string, isTyping = false): string {
  if (!input) return '';

  const parts = input.split(/(\s+|[-–—:]+)/);
  let isMajorBreak = true;

  return parts
    .map((segment, index) => {
      if (!segment) return '';
      if (/^[-–—:]+$/.test(segment)) {
        isMajorBreak = true;
        return segment;
      }
      if (/^\s+$/.test(segment)) {
        return segment;
      }

      const lower = segment.toLowerCase();
      const isFirstInClause = isMajorBreak;
      isMajorBreak = false;
      const hasTrailingDelimiter = index < parts.length - 1;

      if (ROMAN_NUMERALS.has(lower)) {
        return lower.toUpperCase();
      }

      if (!isFirstInClause && LOWERCASE_WORDS.has(lower)) {
        if (!isTyping || hasTrailingDelimiter) {
          return lower;
        }
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}
