"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import Axios from 'utils/Axios';
import Button from 'utils/Button';
import { SilHouse, silHouseFeatures } from 'app/data/silHouses';

export default function SilHouseDetail() {
  const { id } = useParams<{ id: string }>();
  const [house, setHouse] = useState<SilHouse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

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

  return (
    <div className="container mx-auto px-5 py-10">
      <Link href="/sil-house" className="text-primary underline">Back to SIL House Properties</Link>
      {loading ? <p role="status" className="py-10">Loading property...</p> : error ? (
        <div role="alert" className="py-10">{error} <button onClick={() => setAttempt(value => value + 1)} className="underline">Try again</button></div>
      ) : house && (
        <div className="flex flex-col gap-8 mt-8">
          <h1 className="text-primary text-4xl font-bold">{house.address}</h1>
          <Image src={house.image} alt={house.address} width={1200} height={800} className="w-full max-h-[600px] object-contain rounded" />
          <div className="flex flex-wrap gap-8">
            {silHouseFeatures(house).map(feature => <div key={feature.label} className="flex flex-col items-center gap-2"><Image src={feature.icon} alt="" /><span>{feature.label}</span></div>)}
          </div>
          {house.description && <p className="whitespace-pre-wrap text-lg text-secondary-text">{house.description}</p>}
          {house.gallery.length > 0 && <section><h2 className="text-3xl font-semibold mb-6">SIL House Gallery</h2><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">{house.gallery.map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer"><Image src={url} alt={`${house.address} photo ${index + 1}`} width={600} height={450} className="w-full h-64 object-cover rounded" /></a>)}</div></section>}
          <div className="flex gap-6"><Button path="/contact-us" label="Enquire Now" /><Button path="/referral" label="Referral" /></div>
        </div>
      )}
    </div>
  );
}
