"use client"
import { useEffect, useState, type ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import Axios from 'utils/Axios'
import { eventImage, type SiteEvent } from 'app/data/events'
import ConfirmDeleteModal, { type DeleteRequest } from './ConfirmDeleteModal'
import { setManagedPageCache } from 'app/(main)/(pages)/_managed/useManagedPage'

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2'
const labels: { key: keyof SiteEvent; label: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Event title' }, { key: 'timeHeading', label: 'Time and date heading' },
  { key: 'time', label: 'Time' }, { key: 'date', label: 'Date or recurrence' },
  { key: 'locationHeading', label: 'Location heading' }, { key: 'location', label: 'Location' },
  { key: 'waiver', label: 'Risk waiver', multiline: true }, { key: 'galleryTitle', label: 'Gallery heading' },
]
const emptyEvent = (status: 'current' | 'past'): SiteEvent => ({ id: crypto.randomUUID(), status, title: '', timeHeading: 'Event Time & Date', time: '', date: '', locationHeading: 'Location:', location: '', intro: [], overview: [], waiver: '', image: '', galleryTitle: '', gallery: [], audience: [] })

export default function EventsEditor({ status }: { status: 'current' | 'past' }) {
  const [events, setEvents] = useState<SiteEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null)
  useEffect(() => { Axios.get('/api/pages/events').then(response => setEvents(response.data.data.events)).catch(() => setError(true)).finally(() => setLoading(false)) }, [])
  const visible = events.filter(event => event.status === status)
  const active = events.find(event => event.id === selected)
  const update = (id: string, patch: Partial<SiteEvent>) => setEvents(items => items.map(item => item.id === id ? { ...item, ...patch } : item))
  const move = (id: string, direction: number) => setEvents(items => { const next = [...items]; const positions = next.map((item, index) => item.status === status ? index : -1).filter(index => index >= 0); const at = positions.findIndex(index => next[index].id === id); const other = at + direction; if (at < 0 || other < 0 || other >= positions.length) return items; [next[positions[at]], next[positions[other]]] = [next[positions[other]], next[positions[at]]]; return next })
  const upload = async (event: ChangeEvent<HTMLInputElement>, id: string, gallery = false) => {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { toast.error('Choose a JPEG, PNG or WebP image up to 5 MB'); return }
    setUploading(true)
    try { const body = new FormData(); body.append('image', file); const result = await Axios.post('/api/pages/events/images', body); const url = result.data?.data?.secure_url || result.data?.data?.url; if (!url) throw new Error('Missing photo URL'); setEvents(items => items.map(item => item.id !== id ? item : gallery ? { ...item, gallery: [...item.gallery, url] } : { ...item, image: url })); toast.success('Photo uploaded. Save events to publish.') }
    catch { toast.error('Unable to upload photo') } finally { setUploading(false) }
  }
  const save = async () => {
    if (events.some(event => !event.title.trim() || !event.image || !event.time.trim() || !event.date.trim())) { toast.error('Each event needs a title, photo, time and date'); return }
    setSaving(true)
    try { const result = await Axios.put('/api/pages/events', { events }); setEvents(result.data.data.events); setManagedPageCache('events', result.data.data); toast.success('Events saved') }
    catch { toast.error('Unable to save events') } finally { setSaving(false) }
  }
  const lineEditor = (key: 'intro' | 'overview' | 'audience', label: string) => <fieldset className="rounded-xl border p-4 space-y-3"><legend className="font-semibold px-2">{label}</legend>{active?.[key].map((line, index) => <div key={index} className="flex gap-2"><textarea className={inputClass} rows={key === 'audience' ? 1 : 3} value={line} onChange={e => update(active.id, { [key]: active[key].map((old, i) => i === index ? e.target.value : old) })} /><button type="button" className="text-red-700 underline" onClick={() => setDeleteRequest({ name: `${label.toLowerCase()} item`, onConfirm: () => { update(active.id, { [key]: active[key].filter((_, i) => i !== index) }); setDeleteRequest(null) } })}>Remove</button></div>)}<button type="button" className="rounded border px-3 py-1" onClick={() => active && update(active.id, { [key]: [...active[key], ''] })}>Add {label.toLowerCase()} item</button></fieldset>
  return <main className="mx-auto max-w-5xl space-y-6 p-6"><div className="flex justify-between gap-4"><div><h1 className="text-2xl font-bold">{status === 'current' ? 'Current Events' : 'Past Events'}</h1><p className="text-gray-600">Create, edit, reorder, move and delete events. Past events are shown from this same saved collection.</p></div><button type="button" className="h-fit rounded-lg bg-[#1a1a18] px-4 py-2 text-white" onClick={() => { const item = emptyEvent(status); setEvents(items => [...items, item]); setSelected(item.id) }}>Add event</button></div>
    {loading && <p>Loading events...</p>}{error && <p role="alert">Unable to load events. Try refreshing the page.</p>}
    {!loading && <div className="grid gap-3">{visible.length === 0 && <p>No {status} events yet.</p>}{visible.map(event => <div key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><strong>{event.title || 'New event'}</strong><div className="flex flex-wrap gap-3 text-sm"><button type="button" className="underline" onClick={() => setSelected(event.id)}>Edit</button><button type="button" className="underline" onClick={() => move(event.id, -1)}>Up</button><button type="button" className="underline" onClick={() => move(event.id, 1)}>Down</button><button type="button" className="underline" onClick={() => { update(event.id, { status: status === 'current' ? 'past' : 'current' }); setSelected(null) }}>Move to {status === 'current' ? 'past' : 'current'}</button><button type="button" className="text-red-700 underline" onClick={() => setDeleteRequest({ name: event.title || 'this event', onConfirm: () => { setEvents(items => items.filter(item => item.id !== event.id)); setSelected(null); setDeleteRequest(null) } })}>Delete</button></div></div>)}</div>}
    {active && <section className="rounded-xl border bg-gray-50 p-5 space-y-5"><h2 className="text-xl font-semibold">Edit {active.title || 'new event'}</h2>{labels.map(({ key, label, multiline }) => <label key={key} className="block space-y-1"><span className="font-medium">{label}</span>{multiline ? <textarea rows={5} className={inputClass} value={active[key] as string} onChange={e => update(active.id, { [key]: e.target.value })} /> : <input className={inputClass} value={active[key] as string} onChange={e => update(active.id, { [key]: e.target.value })} />}</label>)}
      <div className="space-y-2"><strong>Featured image</strong>{active.image && <img src={typeof eventImage(active.image) === 'string' ? eventImage(active.image) as string : (eventImage(active.image) as { src: string }).src} alt="Event" className="max-h-52 rounded object-contain" />}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e, active.id)} /></div>
      {lineEditor('intro', 'Introduction paragraphs')}{lineEditor('overview', 'Overview paragraphs')}{lineEditor('audience', 'Audience labels')}
      <div className="space-y-3"><strong>Gallery photos</strong><div className="flex flex-wrap gap-3">{active.gallery.map((src, index) => <div key={index} className="relative"><img src={typeof eventImage(src) === 'string' ? eventImage(src) as string : (eventImage(src) as { src: string }).src} alt={`Gallery ${index + 1}`} className="h-28 w-32 rounded object-cover" /><button type="button" className="text-red-700 underline text-sm" onClick={() => setDeleteRequest({ name: `gallery photo ${index + 1}`, onConfirm: () => { update(active.id, { gallery: active.gallery.filter((_, i) => i !== index) }); setDeleteRequest(null) } })}>Remove</button></div>)}</div><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => upload(e, active.id, true)} /></div>
      <button type="button" className="underline" onClick={() => setSelected(null)}>Close editor</button></section>}
    <ConfirmDeleteModal request={deleteRequest} onClose={() => setDeleteRequest(null)} />
    <button type="button" disabled={saving || uploading || loading || error} onClick={save} className="rounded-lg bg-[#1a1a18] px-5 py-3 text-white disabled:opacity-50">{saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save events'}</button>
  </main>
}
