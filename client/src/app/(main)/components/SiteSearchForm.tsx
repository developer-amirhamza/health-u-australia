"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { cleanSearchQuery, houseSearchDocuments, MAX_SEARCH_LENGTH, mergeSearchDocuments, searchDocuments, type SearchDocument } from 'utils/siteSearch';
import { publicSearchDocuments } from 'app/data/searchDocuments';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';

interface Props {
  initialQuery?: string;
  variant?: 'header' | 'page';
  onNavigate?: () => void;
}

export default function SiteSearchForm({ initialQuery = '', variant = 'header', onNavigate }: Props) {
  const router = useRouter();
  const id = useId();
  const container = useRef<HTMLFormElement>(null);
  const [value, setValue] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [houses, setHouses] = useState<SearchDocument[]>([]);
  const [propertyStatus, setPropertyStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const query = cleanSearchQuery(value);
  const hasQuery = variant === 'header' && Boolean(query);
  const results = useMemo(() => hasQuery ? searchDocuments(mergeSearchDocuments(publicSearchDocuments, houses), query).slice(0, 6) : [], [hasQuery, houses, query]);
  const expanded = open && hasQuery;

  // Fetch public properties once when typing starts, not on every keystroke.
  useEffect(() => {
    if (!hasQuery) return;
    const controller = new AbortController();
    setPropertyStatus('loading');
    Axios({ ...SummeryApi.silHouses, signal: controller.signal })
      .then(response => { setHouses(houseSearchDocuments(response.data.data)); setPropertyStatus('ready'); })
      .catch(() => { if (!controller.signal.aborted) setPropertyStatus('error'); });
    return () => controller.abort();
  }, [hasQuery]);

  useEffect(() => {
    function outside(event: MouseEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setActive(-1);
    router.push(href);
    onNavigate?.();
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (variant !== 'header') return;
    if (event.key === 'Escape') { setOpen(false); setActive(-1); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true);
      if (results.length) setActive(index => event.key === 'ArrowDown' ? (index + 1) % results.length : (index <= 0 ? results.length - 1 : index - 1));
    }
    if (event.key === 'Enter' && expanded && active >= 0 && results[active]) {
      event.preventDefault();
      navigate(results[active].href);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem('q') as HTMLInputElement;
    const query = cleanSearchQuery(input.value);
    if (!query) {
      input.setCustomValidity('Enter a search term.');
      input.reportValidity();
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <form ref={container} action="/search" method="get" role="search" aria-label="Search the website" onSubmit={submit}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }} className="flex items-center w-full relative">
      <label htmlFor={id} className="sr-only">Search the website</label>
      <input id={id} name="q" type="text" required maxLength={MAX_SEARCH_LENGTH} value={value} autoComplete="off"
        role={variant === 'header' ? 'combobox' : undefined} aria-autocomplete={variant === 'header' ? 'list' : undefined}
        aria-expanded={variant === 'header' ? expanded : undefined} aria-controls={expanded ? `${id}-results` : undefined}
        aria-activedescendant={expanded && active >= 0 && results[active] ? `${id}-result-${active}` : undefined}
        onChange={event => { event.currentTarget.setCustomValidity(''); setValue(event.target.value); setActive(-1); setOpen(true); }}
        onFocus={() => setOpen(true)} onKeyDown={keyDown}
        placeholder={variant === 'page' ? 'Search the website' : undefined}
        className={variant === 'header' ? 'outline-none border border-white px-5 py-1.5 w-full flex rounded-full' : 'border border-gray-400 px-5 pr-14 py-2 w-full rounded-full bg-white text-gray-900 focus:outline-primary'} />
      <button type="submit" aria-label="Search" className="absolute right-0 border-l px-2.5 py-2">
        <FaSearch size={22} aria-hidden="true" />
      </button>
      {expanded && <div className="absolute top-full left-0 right-0 mt-2 bg-white text-neutral-900 rounded shadow-xl border border-neutral-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
        <ul id={`${id}-results`} role="listbox" aria-label="Search results">
          {results.map((result, index) => <li key={result.href} role="presentation">
            <Link id={`${id}-result-${index}`} role="option" aria-selected={index === active} href={result.href}
              onClick={() => { setOpen(false); setActive(-1); onNavigate?.(); }}
              className={`block px-4 py-3 border-b border-neutral-100 hover:bg-gray-100 focus:bg-gray-100 ${index === active ? 'bg-gray-100' : ''}`}>
              <span className="block text-sm font-semibold">{result.title}</span>
              <span className="block text-xs text-gray-500 mt-1">{result.category}</span>
            </Link>
          </li>)}
        </ul>
        <div className="text-xs text-gray-600 px-4 py-2" role="status" aria-live="polite">
          {results.length ? `${results.length} suggestions` : 'No matching pages found.'}
          {propertyStatus === 'loading' && ' Searching current properties...'}
          {propertyStatus === 'error' && ' Current property listings are temporarily unavailable.'}
        </div>
        <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { setOpen(false); onNavigate?.(); }} className="block border-t border-neutral-200 px-4 py-3 text-sm font-semibold text-primary hover:underline">View all results</Link>
      </div>}
    </form>
  );
}
