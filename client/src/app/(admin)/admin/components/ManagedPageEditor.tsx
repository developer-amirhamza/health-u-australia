"use client"
import { useEffect, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import Axios from 'utils/Axios'
import { FiEye, FiX } from 'react-icons/fi'
import { FaAccessibleIcon, FaHeart, FaCommentDots } from 'react-icons/fa'
import PageLoader from 'app/(main)/(pages)/_managed/PageLoader'
import { ManagedPagePreviewContext, setManagedPageCache } from 'app/(main)/(pages)/_managed/useManagedPage'
import NDISView from 'app/(main)/(pages)/ndis/NDISView'
import CompassionView from 'app/(main)/(pages)/compassion-in-action/CompassionView'
import FeedbackView from 'app/(main)/(pages)/participant-feedback/FeedbackView'
import ConfirmDeleteModal, { type DeleteRequest } from './ConfirmDeleteModal'
import AboutContent from 'app/(main)/components/AboutContent'
import Career from 'app/pages/Career'
import Contact from 'app/pages/Contact'

type Json = string | Json[] | { [key: string]: Json }
const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2'
const sectionNames: Record<string, string> = {
  banner: 'Page header banner', sections: 'Main content sections', images: 'Main page photos',
  intro: 'Header introduction', contact: 'Quick contact card', typesTitle: 'Feedback cards heading',
  types: 'Feedback cards', rightsTitle: 'Participant rights heading', rightsIntro: 'Participant rights introduction',
  rights: 'Participant rights points', processTitle: 'Complaints process heading', steps: 'Complaints process steps',
  paragraphs: 'Main text paragraphs', servicesTitle: 'Service boxes heading', services: 'Service boxes',
  cta: 'Footer call to action', links: 'Footer buttons',
}

function itemName(label: string, item: Json, index: number) {
  if (typeof item === 'object' && !Array.isArray(item)) {
    const named = [item.title1, item.title2].filter(part => typeof part === 'string' && part.trim()).join(' ')
      || [item.title, item.name, item.label].find(part => typeof part === 'string' && part.trim())
    if (named) return String(named)
    if (item.step) return `Process step ${item.step}`
  }
  if (label === 'images') return `Photo ${index + 1}`
  if (label === 'paragraphs') return `Paragraph ${index + 1}`
  if (label === 'rights') return `Right ${index + 1}`
  if (label === 'bullets') return `Bullet point ${index + 1}`
  return `Content block ${index + 1}`
}

function blankFrom(template: Json): Json {
  if (typeof template === 'string') return ''
  if (Array.isArray(template)) return []
  return Object.fromEntries(Object.entries(template).map(([key, value]) => [key, blankFrom(value)]))
}

function AddressField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open || value.trim().length < 2) return
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: value, countrycode: 'AU', lat: '-33.815', lon: '151.1', limit: '6' })
        const response = await fetch(`https://photon.komoot.io/api?${params}`, { signal: controller.signal })
        const data: { features: { properties: { housenumber?: string; street?: string; name?: string; city?: string; state?: string; postcode?: string; country?: string } }[] } = await response.json()
        setSuggestions([...new Set(data.features.map(({ properties: p }) => [[p.housenumber, p.street || p.name].filter(Boolean).join(' '), p.city, p.state, p.postcode, p.country].filter(Boolean).join(', ')).filter(Boolean))])
      } catch { if (!controller.signal.aborted) setSuggestions([]) }
    }, 600)
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [value, open])
  return <div className="relative"><label className="block font-medium">Address<input className={inputClass} value={value} autoComplete="off" onChange={event => { onChange(event.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onBlur={() => window.setTimeout(() => setOpen(false), 150)} /></label>
    {open && suggestions.length > 0 && <ul className="absolute z-20 w-full max-h-60 overflow-y-auto rounded border bg-white shadow">{suggestions.map(address => <li key={address}><button type="button" className="w-full p-2 text-left hover:bg-gray-100" onMouseDown={event => event.preventDefault()} onClick={() => { onChange(address); setOpen(false) }}>{address}</button></li>)}</ul>}
    <p className="text-xs text-gray-500">Suggestions from Photon and OpenStreetMap. You can also type an address manually.</p>
  </div>
}

function Field({ label, value, template, slug, onChange, onUploadChange, onRequestDelete }: { label: string; value: Json; template: Json; slug: string; onChange: (value: Json) => void; onUploadChange: (delta: number) => void; onRequestDelete: (request: DeleteRequest) => void }) {
  const [uploading, setUploading] = useState(false)
  const heading = sectionNames[label] ?? label.replace(/([A-Z])/g, ' $1')
  if (typeof value === 'string' && label === 'address' && slug === 'contact-us') return <AddressField value={value} onChange={onChange} />
  if (typeof value === 'string' && (label === 'image' || label === 'src')) {
    const upload = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        toast.error('Choose a JPEG, PNG or WebP image up to 5 MB')
        return
      }
      setUploading(true)
      onUploadChange(1)
      try {
        const form = new FormData()
        form.append('image', file)
        const response = await Axios.post(`/api/pages/${slug}/images`, form)
        const url: string | undefined = response.data?.data?.secure_url || response.data?.data?.url
        if (!url) throw new Error('Upload did not return an image')
        onChange(url)
        toast.success('Photo uploaded. Save the page to publish it.')
      } catch { toast.error('Unable to upload photo') }
      finally { setUploading(false); onUploadChange(-1) }
    }
    return <div className="space-y-2"><span className="block font-medium capitalize">{heading}</span>
      {value && <img src={value} alt="Selected page photo" className="max-h-64 w-auto rounded-lg border object-contain" />}
      <label className="block text-sm">Upload a photo from your computer (JPEG, PNG or WebP, up to 5 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} className="mt-2 block w-full" onChange={upload} />
      </label>
      {uploading && <p role="status" className="text-sm">Uploading photo...</p>}
    </div>
  }
  if (typeof value === 'string') return <label className="block space-y-1"><span className="font-medium capitalize">{heading}</span><textarea rows={value.length > 90 ? 4 : 2} className={inputClass} value={value} onChange={event => onChange(event.target.value)} /></label>
  if (Array.isArray(value)) {
    const sample = Array.isArray(template) && template.length ? template[0] : label === 'bullets' ? { keyword: '', text: '' } : undefined
    const move = (from: number, to: number) => {
      const next = [...value]
      next.splice(to, 0, next.splice(from, 1)[0])
      onChange(next)
    }
    return <fieldset className="space-y-4 rounded-xl border p-4"><legend className="px-2 font-semibold capitalize">{heading}</legend>
      {value.length === 0 && <p className="text-sm text-gray-600">No items yet.</p>}
      {value.map((item, index) => <div key={index} className="rounded-lg border bg-gray-50 p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><strong>{itemName(label, item, index)}</strong><div className="flex gap-3 text-sm">
          <button type="button" className="underline disabled:opacity-40" disabled={index === 0} onClick={() => move(index, index - 1)}>Move up</button>
          <button type="button" className="underline disabled:opacity-40" disabled={index === value.length - 1} onClick={() => move(index, index + 1)}>Move down</button>
          <button type="button" className="underline" onClick={() => onChange([...value.slice(0, index + 1), structuredClone(item), ...value.slice(index + 1)])}>Duplicate</button>
          <button type="button" className="text-red-700 underline" onClick={() => onRequestDelete({ name: itemName(label, item, index), onConfirm: () => onChange(value.filter((_, i) => i !== index)) })}>Delete</button>
        </div></div>
        <Field label="Content" value={item} template={sample ?? item} slug={slug} onChange={next => onChange(value.map((old, i) => i === index ? next : old))} onUploadChange={onUploadChange} onRequestDelete={onRequestDelete} />
      </div>)}
      {sample && <button type="button" className="rounded-lg bg-[#1a1a18] px-4 py-2 text-white" onClick={() => onChange([...value, blankFrom(sample)])}>Add item</button>}
    </fieldset>
  }
  const shape = typeof template === 'object' && !Array.isArray(template) ? template : value
  const fields = <div className="space-y-4">{Object.entries(value).map(([key, child]) => <Field key={key} label={key} value={child} template={shape[key] ?? child} slug={slug} onChange={next => onChange({ ...value, [key]: next })} onUploadChange={onUploadChange} onRequestDelete={onRequestDelete} />)}</div>
  if (label === 'Page content' || label === 'Content') return fields
  return <fieldset className="rounded-xl border p-4"><legend className="px-2 font-semibold">{heading}</legend>{fields}</fieldset>
}

export default function ManagedPageEditor({ title, slug }: { title: string; slug: string }) {
  const [content, setContent] = useState<Json | null>(null)
  const [template, setTemplate] = useState<Json | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [error, setError] = useState(false)
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null)
  useEffect(() => {
    Promise.all([Axios.get(`/api/pages/${slug}`), Axios.get(`/api/pages/${slug}/template`)])
      .then(([page, original]) => { setContent(page.data.data); setTemplate(original.data.data) })
      .catch(() => setError(true)).finally(() => setLoading(false))
  }, [slug])
  useEffect(() => {
    if (!previewOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreviewOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [previewOpen])
  async function save() {
    if (!content || uploadCount > 0) return
    setSaving(true)
    try { const response = await Axios.put(`/api/pages/${slug}`, content); setContent(response.data.data); setManagedPageCache(slug, response.data.data); toast.success('Page saved') }
    catch { toast.error('Unable to save page') }
    finally { setSaving(false) }
  }
  const Preview = slug === 'ndis' ? NDISView : slug === 'compassion-in-action' ? CompassionView : slug === 'participant-feedback' ? FeedbackView : slug === 'about' ? AboutContent : slug === 'career' ? Career : Contact
  const PageIcon = slug === 'ndis' ? FaAccessibleIcon : slug === 'compassion-in-action' ? FaHeart : FaCommentDots
  return <main className="mx-auto max-w-5xl space-y-6 p-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a1a18] text-[#c9b89a]"><PageIcon size={23} aria-hidden="true" /></div><div><h1 className="text-2xl font-bold">{title}</h1><p className="text-gray-600">Add, edit, reorder and delete the content shown on this page.</p></div></div>
      <button type="button" disabled={!content || uploadCount > 0} onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium disabled:opacity-50" aria-label={`Preview ${title}`}><FiEye aria-hidden="true" /> Preview</button>
    </div>
    {loading && <PageLoader label={`Loading ${title} content`} compact />}{error && <p role="alert">Unable to load page content.</p>}
    {content && template && <><Field label="Page content" value={content} template={template} slug={slug} onChange={setContent} onUploadChange={delta => setUploadCount(count => Math.max(0, count + delta))} onRequestDelete={setDeleteRequest} /><button disabled={saving || uploadCount > 0} onClick={save} className="rounded-lg bg-[#1a1a18] px-5 py-3 text-white disabled:opacity-50">{saving ? 'Saving...' : uploadCount > 0 ? 'Uploading photo...' : 'Save page'}</button></>}
    <ConfirmDeleteModal request={deleteRequest && { ...deleteRequest, onConfirm: () => { deleteRequest.onConfirm(); setDeleteRequest(null) } }} onClose={() => setDeleteRequest(null)} />
    {previewOpen && content && createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm md:p-6" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPreviewOpen(false) }}>
      <div className="flex h-[min(84vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label={`${title} preview`}>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a1a18] text-[#c9b89a]"><PageIcon aria-hidden="true" /></div><div><strong>{title} preview</strong><p className="text-xs text-gray-600">Your current edits. Save to publish.</p></div></div><button type="button" onClick={() => setPreviewOpen(false)} aria-label="Close preview" className="rounded-full p-2 hover:bg-gray-100"><FiX size={22} /></button></div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" onClickCapture={event => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }}><ManagedPagePreviewContext.Provider value={{ slug, data: content }}><Preview /></ManagedPagePreviewContext.Provider></div>
      </div>
    </div>, document.body)}
  </main>
}
