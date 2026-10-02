import type { Metadata } from 'next';
import SearchResults from './SearchResults';
import { cleanSearchQuery } from 'utils/siteSearch';

export const metadata: Metadata = {
  title: 'Search Health U Australia',
  description: 'Search services, properties, events and more across Health U Australia.',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = cleanSearchQuery(typeof params.q === 'string' ? params.q : '');
  return <SearchResults key={query} query={query} />;
}
