export interface SearchDocument {
  title: string;
  href: string;
  category: string;
  description: string;
  content?: string;
  keywords?: string;
}

export interface SearchResult extends SearchDocument {
  score: number;
  snippet: string;
}

export const MAX_SEARCH_LENGTH = 120;
export const cleanSearchQuery = (query: string) => query.trim().slice(0, MAX_SEARCH_LENGTH);

function normalize(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

// Index readable content from the existing public content arrays, excluding assets
// and navigation URLs. Never pass user records or admin data into this index.
export function searchableText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(searchableText).filter(Boolean).join(' ');
  if (!value || typeof value !== 'object' || 'src' in value) return '';
  return Object.entries(value)
    .filter(([key]) => !['id', 'image', 'icon', 'path', 'href', 'url', 'link'].includes(key))
    .map(([, item]) => searchableText(item)).filter(Boolean).join(' ');
}

export function mergeSearchDocuments(...groups: SearchDocument[][]): SearchDocument[] {
  const documents = new Map<string, SearchDocument>();
  for (const document of groups.flat()) {
    // Results are internal navigation only.
    if (!document.href.startsWith('/') || document.href.startsWith('//')) continue;
    const key = document.href.replace(/\/+$/, '') || '/';
    const previous = documents.get(key);
    documents.set(key, { ...document, content: [previous?.content, document.content].filter(Boolean).join(' ') });
  }
  return [...documents.values()];
}

export function searchDocuments(documents: SearchDocument[], query: string): SearchResult[] {
  const phrase = normalize(cleanSearchQuery(query));
  if (!phrase) return [];
  const terms = [...new Set(phrase.split(' '))];
  return mergeSearchDocuments(documents).flatMap(document => {
    const title = normalize(document.title);
    const description = normalize(document.description);
    const keywords = normalize(document.keywords || '');
    const body = normalize(document.content || '');
    const text = `${title} ${description} ${keywords} ${body}`;
    if (!terms.every(term => text.includes(term))) return [];
    const score = (title === phrase ? 100 : title.includes(phrase) ? 50 : 0)
      + terms.reduce((total, term) => total + (title.includes(term) ? 12 : 0)
        + (keywords.includes(term) ? 6 : 0) + (description.includes(term) ? 4 : 0), 0);
    // Prefer a matching sentence from the page when its summary doesn't match.
    const sentences = (document.content || '').split(/(?<=[.!?])\s+/);
    const matchingSentence = sentences.find(sentence => terms.every(term => normalize(sentence).includes(term)));
    const excerpt = terms.some(term => description.includes(term)) ? document.description : matchingSentence || document.description;
    const snippet = excerpt.length > 230 ? `${excerpt.slice(0, 227).trimEnd()}...` : excerpt;
    return [{ ...document, score, snippet }];
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

interface SearchableHouse {
  id: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  accessible: boolean;
  legacyPath: string | null;
}

export function houseSearchDocuments(houses: SearchableHouse[]): SearchDocument[] {
  return houses.map(house => ({
    title: house.address,
    href: house.legacyPath || `/sil-house/${encodeURIComponent(house.id)}`,
    category: 'SIL House',
    description: `${house.bedrooms} bedrooms, ${house.bathrooms} bathrooms, ${house.parking} parking spaces.${house.accessible ? ' Fully Accessible.' : ''} ${house.description}`.trim(),
    keywords: `SIL house property housing supported independent living accommodation${house.accessible ? ' wheelchair accessible' : ''}`,
  }));
}
