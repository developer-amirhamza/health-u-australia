"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Axios from 'utils/Axios';
import { SummeryApi } from 'app/common/SummeryApi';
import { publicSearchDocuments } from 'app/data/searchDocuments';
import { houseSearchDocuments, mergeSearchDocuments, searchDocuments, type SearchDocument } from 'utils/siteSearch';
import SiteSearchForm from 'app/(main)/components/SiteSearchForm';

export default function SearchResults({ query }: { query: string }) {
  const [houses, setHouses] = useState<SearchDocument[]>([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    setLoading(true);
    setError(false);
    Axios({ ...SummeryApi.silHouses, signal: controller.signal })
      .then(response => setHouses(houseSearchDocuments(response.data.data)))
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, attempt]);

  const results = useMemo(() => searchDocuments(mergeSearchDocuments(publicSearchDocuments, houses), query), [houses, query]);

  return (
    <main className="container mx-auto max-w-4xl px-5 py-10 min-h-[60vh]">
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">Search the website</h1>
      <SiteSearchForm variant="page" initialQuery={query} />
      {!query ? <p className="mt-6 text-secondary-text">Search our services, SIL houses, events, careers and contact information.</p> : <>
        <div className="mt-6 mb-4" role="status" aria-live="polite">
          {results.length > 0 && <p>{results.length} {results.length === 1 ? 'result' : 'results'} for <strong>“{query}”</strong></p>}
          {loading && <p className="text-sm text-gray-600 mt-2">Searching current SIL house listings...</p>}
          {!loading && results.length === 0 && <p>No results found for <strong>“{query}”</strong>. Try a service name, suburb or a shorter search.</p>}
        </div>
        {error && <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 mb-6 text-sm">Current property listings could not be searched. Other website results are still available. <button type="button" className="underline font-semibold" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>}
        <ul className="divide-y divide-gray-200">
          {results.map(result => <li key={result.href} className="py-6">
            <span className="text-sm text-gray-600">{result.category}</span>
            <h2 className="text-xl font-semibold mt-1"><Link className="text-primary hover:underline focus-visible:underline" href={result.href}>{result.title}</Link></h2>
            <p className="mt-2 text-secondary-text">{result.snippet}</p>
          </li>)}
        </ul>
      </>}
    </main>
  );
}
