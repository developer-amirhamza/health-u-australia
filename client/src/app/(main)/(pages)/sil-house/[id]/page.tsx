"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Axios from 'utils/Axios';
import Button from 'utils/Button';
import Title from 'utils/Title';
import { FaPlus } from 'react-icons/fa';
import { SilHouse, silHouseFeatures } from 'app/data/silHouses';

const belmoreFeatures = [
  'Single-storey with ramp access', 'Wide pathways for accessibility',
  'Air conditioning & heating', 'Secure backyard & front yard',
  'Outdoor entertainment area', 'Private & shared living spaces',
  'Built-in wardrobes', 'Private & shared bathrooms',
];
const originalFeatures: Record<string, string[]> = {
  'sil-belmore': belmoreFeatures,
  'sil-granny-flat': belmoreFeatures,
  'sil-bowden': [
    'Ramp access', 'Wide pathways', 'Air conditioning & heating',
    'Single-level living', 'Shared and private living spaces',
    'Private/ensuite bathrooms', 'Built-in wardrobes',
    'Storage for personal equipment', 'Secure backyard & front yard',
    'Raised garden beds', 'Deck/verandah', 'Outdoor entertainment area',
  ],
  'sil-normanhurst': [
    'Single-storey home', 'Ramp access', 'Wide doorframes & pathways',
    'Wheelchair accessible', 'Air conditioning',
    'Secure backyard & front yard', 'Garden and green space',
    'Deck / verandah', 'Outdoor entertainment area',
    'Undercover access from parking', 'Shared living and kitchen',
    'Shared laundry', 'Built-in wardrobes', 'Direct access to outdoor areas',
  ],
};

export default function SilHouseDetail() {
  const { id } = useParams<{ id: string }>();
  const [house, setHouse] = useState<SilHouse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [slide, setSlide] = useState(0);
  const [gallerySlide, setGallerySlide] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Axios.get(`/api/sil-houses/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(response => setHouse(response.data.data))
      .catch(error => {
        if (!controller.signal.aborted) setError(axios.isAxiosError(error) && error.response?.status === 404 ? 'This property is no longer listed.' : 'Unable to load this property. Please try again.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, attempt]);

  useEffect(() => {
    if (!house || house.gallery.length === 0) return;
    const timer = window.setInterval(() => setSlide(value => (value + 1) % (house.gallery.length + 1)), 5000);
    return () => window.clearInterval(timer);
  }, [house]);

  useEffect(() => {
    if (gallerySlide === null || !house) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGallerySlide(null);
      if (event.key === 'ArrowRight') setGallerySlide(value => value === null ? null : (value + 1) % house.gallery.length);
      if (event.key === 'ArrowLeft') setGallerySlide(value => value === null ? null : (value - 1 + house.gallery.length) % house.gallery.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gallerySlide, house]);

  return (
    <div className="w-full">
      {loading ? <p role="status" className="py-10">Loading property...</p> : error ? (
        <div role="alert" className="py-10">{error} <button onClick={() => setAttempt(value => value + 1)} className="underline">Try again</button></div>
      ) : house && (
        <div>
          <section className="relative min-h-[70vh] md:min-h-[90vh] bg-gray-800">
            <Image src={[house.image, ...house.gallery][slide % (house.gallery.length + 1)]} alt={house.address} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 flex items-center"><div className="container mx-auto px-6"><div className="bg-black/50 text-white rounded p-8 max-w-2xl"><h1 className="text-xl md:text-3xl uppercase">{house.address}</h1><p className="mt-3">Supported Independent Living, STA, MTA and respite accommodation</p><div className="flex gap-4 mt-6"><Link href="/contact-us" className="border border-white rounded px-4 py-2">Enquire Now</Link><Link href="/referral" className="border border-white rounded px-4 py-2">Referral</Link></div></div></div></div>
            {house.gallery.length > 0 && <div className="absolute inset-x-6 top-1/2 flex justify-between text-white"><button aria-label="Previous photo" className="bg-black/50 px-4 py-3 rounded" onClick={() => setSlide(value => (value - 1 + house.gallery.length + 1) % (house.gallery.length + 1))}>‹</button><button aria-label="Next photo" className="bg-black/50 px-4 py-3 rounded" onClick={() => setSlide(value => (value + 1) % (house.gallery.length + 1))}>›</button></div>}
          </section>
          <section className="max-w-6xl mx-auto px-6 py-12"><Link href="/sil-house" className="text-primary underline">Back to SIL House Properties</Link><Title title1="NDIS SIL & Respite Housing in" title2={house.address} /><p className="text-gray-600 mb-8 whitespace-pre-wrap">{house.description || 'A comfortable, supportive home for NDIS participants seeking supported independent living, short stays or respite care.'}</p><div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">{silHouseFeatures(house).map(feature => <div key={feature.label} className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg"><Image src={feature.icon} alt="" /><span className="font-semibold">{feature.label}</span></div>)}</div></section>
          <section className="bg-gray-50 px-6 py-12"><div className="max-w-6xl mx-auto"><div className="mb-6 group"><h2 className="text-[32px] font-bold text-center py-3">Location <span className="text-secondary">Map</span></h2><div className="h-0.75 w-14 mx-auto bg-primary group-hover:w-full transition-[width] duration-500" /></div><iframe title={`${house.address} property location`} src={house.id === 'sil-belmore' ? 'https://www.google.com/maps/d/embed?mid=1pw_m1V9YtvaXSVaK5tZUn8EROw1x-oA&ehbc=2E312F&noprof=1' : `https://www.google.com/maps?q=${encodeURIComponent(house.address)}&output=embed`} className="w-full min-h-125 border-4 border-secondary rounded" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></section>
          <section className="max-w-6xl mx-auto px-6 py-10"><Title title1="Prime Location in" title2={house.address.includes('Normanhurst') ? 'Normanhurst' : 'Ryde'} /><p className="text-gray-600 mb-6">Close to hospitals, transport, and shopping centres for maximum convenience and support access.</p>{house.id === 'sil-normanhurst' ? <ul className="grid md:grid-cols-2 gap-4 text-gray-700"><li>🏥 Hornsby Ku-ring-gai & Sydney Adventist Hospitals</li><li>🛍️ Hornsby Westfield nearby</li><li>🚉 Normanhurst Train Station and bus stops nearby</li><li>🌳 Parks, cafes and community facilities nearby</li></ul> : <ul className="grid md:grid-cols-2 gap-4 text-gray-700"><li>🏥 Ryde, Macquarie & Concord Hospitals</li><li>🛍️ Top Ryde & Macquarie Centre</li><li>🚍 Bus at your doorstep</li><li>🌳 Parks & Parramatta River nearby</li></ul>}</section>
          {house.gallery.length > 0 && <section className="max-w-6xl mx-auto px-6 py-12"><Title title1="SIL House" title2="Gallery" /><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{house.gallery.map((url, index) => <button type="button" key={`${url}-${index}`} aria-label={`Open ${house.address} photo ${index + 1}`} onClick={() => setGallerySlide(index)} className="relative group overflow-hidden rounded cursor-pointer"><Image src={url} alt={`${house.address} photo ${index + 1}`} width={600} height={450} className="w-full h-64 object-cover" /><span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"><FaPlus className="text-white text-4xl" /></span></button>)}</div></section>}
          <section className="bg-gray-100 py-12"><div className="max-w-6xl mx-auto px-6"><Title title1="Property" title2="Features" /><ul className="grid md:grid-cols-2 gap-4 text-gray-700">{(originalFeatures[house.id] || [`${house.bedrooms} bedrooms`, `${house.bathrooms} bathrooms`, `${house.parking} parking spaces`, ...(house.accessible ? ['Accessible accommodation'] : [])]).map(feature => <li key={feature}>✔ {feature}</li>)}</ul></div></section>
          <section className="max-w-6xl mx-auto px-6 py-12"><h2 className="text-3xl font-bold mb-6">Provider Details</h2><p>SIL Provider: Health U Australia</p><h2 className="text-3xl font-bold mt-12 mb-6">Application Criteria</h2><ul className="grid gap-4 text-gray-700"><li>✔ Flexible support levels tailored to individual goals and preferences.</li><li>✔ Short-term, long-term and respite enquiries are welcome.</li><li>✔ Contact our team to discuss the application process and availability.</li></ul><div className="flex gap-6 mt-8"><Button path="/contact-us" label="Enquire Now" /><Button path="/referral" label="Referral" /></div></section>
          {gallerySlide !== null && <div role="dialog" aria-modal="true" aria-label="SIL house photo gallery" className="fixed inset-0 z-100 bg-neutral-900/95 flex items-center justify-center p-4" onClick={() => setGallerySlide(null)}><div className="relative w-full max-w-5xl flex items-center justify-center" onClick={event => event.stopPropagation()}><button type="button" aria-label="Close gallery" className="absolute right-0 -top-12 text-white text-3xl" onClick={() => setGallerySlide(null)}>×</button><button type="button" aria-label="Previous gallery photo" className="absolute left-0 z-10 bg-white/90 text-primary text-3xl px-3 rounded" onClick={() => setGallerySlide(value => value === null ? null : (value - 1 + house.gallery.length) % house.gallery.length)}>‹</button><Image src={house.gallery[gallerySlide]} alt={`${house.address} photo ${gallerySlide + 1} of ${house.gallery.length}`} width={1200} height={800} className="max-h-[80vh] w-auto object-contain rounded" /><button type="button" aria-label="Next gallery photo" className="absolute right-0 z-10 bg-white/90 text-primary text-3xl px-3 rounded" onClick={() => setGallerySlide(value => value === null ? null : (value + 1) % house.gallery.length)}>›</button><span className="absolute -bottom-8 text-white">{gallerySlide + 1} / {house.gallery.length}</span></div></div>}
        </div>
      )}
    </div>
  );
}
