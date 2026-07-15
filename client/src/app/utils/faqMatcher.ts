import { FaqEntry } from "../data/faq";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "you", "your", "i", "me", "my",
  "can", "could", "what", "how", "who", "where", "when", "to", "for", "of",
  "in", "on", "and", "or", "with", "about",
]);

function significantWords(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

/** Scores each FAQ entry against the user's input and returns the best match, or null if nothing scores highly enough. */
export function matchFaq(input: string, entries: FaqEntry[]): FaqEntry | null {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return null;

  const inputWords = new Set(significantWords(input));

  let best: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of entries) {
    let score = 0;

    for (const keyword of entry.keywords) {
      if (normalizedInput.includes(normalize(keyword))) {
        score += 3;
      }
    }

    for (const word of significantWords(entry.question)) {
      if (inputWords.has(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}
