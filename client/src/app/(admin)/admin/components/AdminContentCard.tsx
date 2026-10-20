import type { ReactNode } from 'react'
import { FiFileText } from 'react-icons/fi'

export default function AdminContentCard({ title, description, image, badge, actions, selected = false }: { title: string; description?: string; image?: string; badge?: string; actions: ReactNode; selected?: boolean }) {
  return <article className={`rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${selected ? 'border-primary ring-1 ring-primary/30' : 'border-gray-200'}`}>
    <div className="flex flex-col gap-5 md:flex-row">
      {image ? <img src={image} alt="" className="h-48 w-full rounded-lg border object-cover md:w-56 md:shrink-0" /> : <div className="flex h-48 w-full items-center justify-center rounded-lg border bg-gray-50 text-gray-400 md:w-56 md:shrink-0"><FiFileText size={46} aria-hidden="true" /></div>}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="break-words text-xl font-bold text-gray-900">{title}</h2>{badge && <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{badge}</span>}</div><div className="flex flex-wrap items-center gap-2">{actions}</div></div>
        {description && <p className="mt-4 line-clamp-5 whitespace-pre-line break-words text-gray-600">{description}</p>}
      </div>
    </div>
  </article>
}
