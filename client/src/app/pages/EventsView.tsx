"use client"
import { useState } from 'react'
import Image from 'next/image'
import PageBanner from 'utils/PageBanner'
import Title from 'utils/Title'
import { motion } from 'framer-motion'
import { fadeIn } from 'app/variants'
import { FaCalendarAlt, FaClock, FaPlus } from 'react-icons/fa'
import { FaMapLocationDot } from 'react-icons/fa6'
import { useManagedPage } from 'app/(main)/(pages)/_managed/useManagedPage'
import { defaultEvents, eventImage, type SiteEvent } from 'app/data/events'

export default function EventsView({ status }: { status: 'current' | 'past' }) {
  const { data } = useManagedPage<{ events: SiteEvent[] }>('events')
  const events = (data?.events ?? defaultEvents).filter(event => event.status === status)
  const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null)
  return <div className="grid w-full h-full gap-10">
    <PageBanner title={status === 'current' ? 'Current Events' : 'Past Events'} path={status === 'current' ? '/current-events' : '/past-events'} />
    {events.length === 0 && <p className="container mx-auto px-5 py-12 text-center text-lg">No {status} events are available right now.</p>}
    {events.map(event => <div key={event.id} id={event.id} className="grid gap-5 scroll-mt-24">
      <div className="container mx-auto items-start w-full justify-center my-10 rounded border-neutral-300 gap-12 border text-secondary-text p-10 flex flex-col md:flex-row">
        <motion.div className="flex flex-col gap-6 items-start py-5 text-lg w-full" initial="hidden" whileInView="show" variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.2 }}>
          <h2 className="text-4xl font-semibold">{event.title}</h2>
          <div className="grid gap-3 py-5"><h3 className="text-2xl font-semibold">{event.timeHeading}</h3><div className="flex flex-wrap items-center gap-10">
            <div className="flex items-center gap-2"><FaClock size={30} className="text-primary shrink-0" /><p className="font-medium text-xl">{event.time}</p></div>
            <div className="flex items-center gap-2"><FaCalendarAlt size={30} className="text-primary shrink-0" /><p className="font-medium text-xl">{event.date}</p></div>
          </div></div>
          <div className="grid gap-3 pb-5"><h3 className="text-2xl font-semibold">{event.locationHeading}</h3><div className="flex items-center gap-2"><FaMapLocationDot size={30} className="text-primary shrink-0" /><p className="font-medium text-xl">{event.location}</p></div></div>
          <div className="grid gap-6">{event.intro.map((text, index) => <p key={index} className={status === 'current' ? 'font-medium text-xl' : 'font-semibold text-sm'}>{text}</p>)}</div>
          {event.overview.length > 0 && <div className="grid gap-3 py-5"><h3 className="text-xl font-semibold">Overview</h3>{event.overview.map((text, index) => <p key={index} className="font-medium">{text}</p>)}</div>}
          {event.waiver && <div className="grid gap-3 py-5"><h3 className="text-2xl font-semibold">Risk waiver:</h3><p className="font-medium">{event.waiver}</p></div>}
        </motion.div>
        <motion.div className="flex w-full h-full items-start justify-center" initial="hidden" whileInView="show" variants={fadeIn('right', 0.3)} viewport={{ once: false, amount: 0.2 }}><Image src={eventImage(event.image)} alt={event.title} width={900} height={700} className="w-full h-auto rounded-md" /></motion.div>
      </div>
      {event.gallery.length > 0 && <div className="container px-5 py-10 flex flex-col items-center mx-auto justify-center w-full gap-8"><Title title1={event.galleryTitle || 'Event Gallery'} title2="" className="place-content-center place-items-center" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-4 w-full">{event.gallery.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setGallery({ images: event.gallery, index })} className="relative group h-56 w-full overflow-hidden rounded-md" aria-label={`View ${event.title} photo ${index + 1}`}><Image src={eventImage(src)} alt={`${event.title} photo ${index + 1}`} fill className="object-cover" /><span className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"><FaPlus className="text-white text-3xl" /></span></button>)}</div>
      </div>}
    </div>)}
    {gallery && <div className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-8" role="dialog" aria-modal="true" aria-label="Event gallery" onClick={e => { if (e.target === e.currentTarget) setGallery(null) }}><button className="absolute top-5 right-5 text-white text-3xl" onClick={() => setGallery(null)} aria-label="Close gallery">×</button><button className="text-white text-4xl p-3" onClick={() => setGallery({ ...gallery, index: (gallery.index - 1 + gallery.images.length) % gallery.images.length })} aria-label="Previous photo">‹</button><Image src={eventImage(gallery.images[gallery.index])} alt="Selected event photo" width={1200} height={800} className="max-w-[80vw] max-h-[85vh] object-contain" /><button className="text-white text-4xl p-3" onClick={() => setGallery({ ...gallery, index: (gallery.index + 1) % gallery.images.length })} aria-label="Next photo">›</button></div>}
  </div>
}
