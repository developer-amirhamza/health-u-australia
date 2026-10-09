"use client";

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';
import { SummeryApi } from 'app/common/SummeryApi';
import { SilHouse, silHousePath } from 'app/data/silHouses';

type HouseForm = Omit<SilHouse, 'id' | 'legacyPath'>;
const emptyForm: HouseForm = { address: '', image: '', bedrooms: 0, bathrooms: 0, parking: 0, accessible: false, description: '', gallery: [], sortOrder: 0 };
const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 bg-white';
const buttonClass = 'rounded-lg px-4 py-2 bg-[#1a1a18] text-white disabled:opacity-50';
type PhotonFeature = { properties: { osm_id?: number; housenumber?: string; street?: string; name?: string; city?: string; state?: string; postcode?: string; country?: string } };

function formatAddress({ properties: p }: PhotonFeature) {
  const street = [p.housenumber, p.street || p.name].filter(Boolean).join(' ');
  return [street, p.city, p.state, p.postcode, p.country].filter(Boolean).join(', ');
}

function AddressSuggestions({ value, onChange }: { value: string; onChange: (address: string) => void }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = value.trim();
    if (!open || query.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: query, countrycode: 'AU', lat: '-33.815', lon: '151.1', limit: '6', layer: 'house' });
        const response = await fetch(`https://photon.komoot.io/api?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Address search unavailable');
        const data: { features: PhotonFeature[] } = await response.json();
        setSuggestions([...new Set(data.features.map(formatAddress).filter(Boolean))]);
      } catch { if (!controller.signal.aborted) setSuggestions([]); }
    }, 600);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [value, open]);

  return <div className="relative">
    <label className="block">Address
      <input required maxLength={300} autoComplete="off" className={inputClass} value={value}
        onChange={event => { onChange(event.target.value); setOpen(true); setSuggestions([]); }}
        onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} />
    </label>
    {open && suggestions.length > 0 && <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg" aria-label="Address suggestions">
      {suggestions.map(address => <li key={address}><button type="button" className="block w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100" onMouseDown={event => event.preventDefault()} onClick={() => { onChange(address); setOpen(false); setSuggestions([]); }}>{address}</button></li>)}
    </ul>}
    <p className="mt-1 text-xs text-gray-500">Suggestions from <a href="https://photon.komoot.io/" target="_blank" rel="noreferrer" className="underline">Photon</a> and OpenStreetMap. You can also type an address manually.</p>
  </div>;
}

export default function AdminSilHouses() {
  const [houses, setHouses] = useState<SilHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState<HouseForm | null>(null);
  const [editing, setEditing] = useState<SilHouse | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'order' | 'address'>('order');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filteredHouses = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return houses.filter(house => house.address.toLocaleLowerCase().includes(search)).sort((a, b) =>
      sort === 'address' ? a.address.localeCompare(b.address) :
      a.sortOrder - b.sortOrder || a.address.localeCompare(b.address));
  }, [houses, query, sort]);
  const pageCount = Math.max(1, Math.ceil(filteredHouses.length / pageSize));
  const visibleHouses = filteredHouses.slice((Math.min(page, pageCount) - 1) * pageSize, Math.min(page, pageCount) * pageSize);

  async function load() {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await Axios({ ...SummeryApi.silHouses });
      setHouses(response.data.data);
    } catch (error) { setLoadError(true); AxiosToastError(error); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function change<K extends keyof HouseForm>(key: K, value: HouseForm[K]) {
    setForm(current => current ? { ...current, [key]: value } : current);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form || busy || uploading) return;
    setBusy(true);
    try {
      const response = await Axios({
        ...(editing ? { url: `/api/sil-houses/${editing.id}`, method: 'put' } : SummeryApi.createSilHouse),
        data: form,
      });
      const saved: SilHouse = response.data.data;
      setHouses(current => [...current.filter(house => house.id !== saved.id), saved].sort((a, b) => a.sortOrder - b.sortOrder));
      setForm(null);
      setEditing(null);
      toast.success(editing ? 'SIL house updated' : 'SIL house added');
    } catch (error) { AxiosToastError(error); }
    finally { setBusy(false); }
  }

  async function remove(house: SilHouse) {
    if (!window.confirm(`Delete "${house.address}" from SIL House Properties? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await Axios.delete(`/api/sil-houses/${house.id}`);
      setHouses(current => current.filter(item => item.id !== house.id));
      toast.success('SIL house deleted');
    } catch (error) { AxiosToastError(error); }
    finally { setBusy(false); }
  }

  async function upload(file: File | undefined, target: 'image' | 'gallery') {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Choose a JPEG, PNG or WebP image up to 5 MB');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const response = await Axios({ ...SummeryApi.uploadSilHouseImage, data });
      const url: string = response.data.data.url;
      setForm(current => current ? { ...current, [target]: target === 'image' ? url : [...current.gallery, url] } : current);
      toast.success('Image uploaded. Save the house to publish it.');
    } catch (error) { AxiosToastError(error); }
    finally { setUploading(false); }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div><h1 className="text-2xl font-bold">SIL Houses</h1><p className="text-gray-600 mt-1">Manage the properties displayed on the SIL House page.</p></div>
        {!form && <button className={buttonClass} disabled={loading || loadError || busy} onClick={() => { setEditing(null); setForm({ ...emptyForm, sortOrder: houses.length ? Math.min(10000, Math.max(...houses.map(house => house.sortOrder)) + 1) : 0 }); }}>Add SIL House</button>}
      </div>

      {form ? (
        <form onSubmit={save} className="bg-white rounded-xl border border-gray-200 p-5 md:p-8 space-y-5">
          <h2 className="text-xl font-semibold">{editing ? 'Edit SIL House' : 'Add SIL House'}</h2>
          <fieldset disabled={busy || uploading} className="space-y-5 disabled:opacity-60">
            <AddressSuggestions value={form.address} onChange={address => change('address', address)} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['bedrooms', 'bathrooms', 'parking', 'sortOrder'] as const).map(key => <label key={key} className="block">{{ bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', parking: 'Parking spaces', sortOrder: 'Display order' }[key]}<input required type="number" min={0} max={key === 'sortOrder' ? 10000 : 100} step={1} className={inputClass} value={Number.isNaN(form[key]) ? '' : form[key]} onChange={event => change(key, event.target.valueAsNumber)} /></label>)}
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.accessible} onChange={event => change('accessible', event.target.checked)} />Fully Accessible</label>
            <label className="block">Cover image URL<input required maxLength={2048} className={inputClass} placeholder="https://..." value={form.image} onChange={event => change('image', event.target.value)} /></label>
            <label className="block text-sm">Or upload cover image (JPEG, PNG or WebP, up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" className="block mt-2" onChange={event => { void upload(event.target.files?.[0], 'image'); event.target.value = ''; }} /></label>
            {form.image && <img src={form.image} alt="Cover preview" className="h-40 max-w-full object-contain rounded" />}
            <>
              <label className="block">Description<textarea rows={6} maxLength={20000} className={inputClass} value={form.description} onChange={event => change('description', event.target.value)} /></label>
              <div className="space-y-3">
                <p>Gallery images ({form.gallery.length}/30)</p>
                {form.gallery.map((url, index) => <div key={index} className="flex gap-2 items-center"><input aria-label={`Gallery image ${index + 1} URL`} required type="text" maxLength={2048} className={inputClass} value={url} onChange={event => change('gallery', form.gallery.map((item, i) => i === index ? event.target.value : item))} /><button type="button" className="text-red-700 underline" onClick={() => change('gallery', form.gallery.filter((_, i) => i !== index))}>Remove</button></div>)}
                <button type="button" className="underline" disabled={form.gallery.length >= 30} onClick={() => change('gallery', [...form.gallery, ''])}>Add image URL</button>
                <label className="block text-sm">Or upload a gallery image<input type="file" accept="image/jpeg,image/png,image/webp" disabled={form.gallery.length >= 30} className="block mt-2" onChange={event => { void upload(event.target.files?.[0], 'gallery'); event.target.value = ''; }} /></label>
              </div>
            </>
          </fieldset>
          {uploading && <p role="status">Uploading image...</p>}
          <div className="flex gap-3"><button type="submit" className={buttonClass} disabled={busy || uploading}>{busy ? 'Saving...' : 'Save SIL House'}</button><button type="button" className="border rounded-lg px-4 py-2" disabled={busy || uploading} onClick={() => { setForm(null); setEditing(null); }}>Cancel</button></div>
        </form>
      ) : loading ? <p role="status">Loading SIL houses...</p> : loadError ? (
        <div role="alert">Unable to load SIL houses. <button className="underline" onClick={load}>Try again</button></div>
      ) : houses.length === 0 ? <p>No SIL houses yet. Add a house to display it on the public page.</p> : (
        <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="block flex-1 min-w-56">Search properties<input type="search" className={inputClass} value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search by address" /></label>
          <label className="block">Sort by<select className={inputClass} value={sort} onChange={event => { setSort(event.target.value as typeof sort); setPage(1); }}><option value="order">Display order</option><option value="address">Address</option></select></label>
          <p className="text-sm text-gray-600 pb-2">{filteredHouses.length} of {houses.length} properties</p>
        </div>
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-left"><thead className="bg-gray-50"><tr><th className="p-4">Property</th><th className="p-4">Features</th><th className="p-4">Order</th><th className="p-4">Actions</th></tr></thead><tbody>
            {visibleHouses.map(house => <tr key={house.id} className="border-t border-gray-200"><td className="p-4"><div className="flex gap-3 items-center"><img src={house.image} alt="" className="w-20 h-16 object-cover rounded" /><span>{house.address}</span></div></td><td className="p-4 text-sm">{house.bedrooms} bedrooms · {house.bathrooms} bathrooms · {house.parking} parking{house.accessible && <span className="block">Fully Accessible</span>}</td><td className="p-4">{house.sortOrder}</td><td className="p-4"><div className="flex gap-4"><Link className="underline" href={silHousePath(house)} target="_blank" rel="noreferrer">View</Link><button className="underline" disabled={busy} onClick={() => { setEditing(house); setForm({ address: house.address, image: house.image, bedrooms: house.bedrooms, bathrooms: house.bathrooms, parking: house.parking, accessible: house.accessible, description: house.description, gallery: [...house.gallery], sortOrder: house.sortOrder }); }}>Edit</button><button className="text-red-700 underline" disabled={busy} onClick={() => remove(house)}>Delete</button></div></td></tr>)}
          </tbody></table>
        </div>
        {filteredHouses.length === 0 && <p>No properties match your search.</p>}
        {pageCount > 1 && <div className="flex items-center justify-end gap-3"><button className="underline disabled:opacity-40" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {Math.min(page, pageCount)} of {pageCount}</span><button className="underline disabled:opacity-40" disabled={page >= pageCount} onClick={() => setPage(value => value + 1)}>Next</button></div>}
        </div>
      )}
    </div>
  );
}
