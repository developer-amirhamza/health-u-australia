"use client"
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export type DeleteRequest = { name: string; onConfirm: () => void | Promise<void> }

export default function ConfirmDeleteModal({ request, onClose, busy = false }: { request: DeleteRequest | null; onClose: () => void; busy?: boolean }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!request) return
    cancelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !busy) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [request, busy, onClose])
  if (!request) return null
  return createPortal(<div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose() }}>
    <div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
      <h2 id="delete-title" className="text-xl font-bold text-gray-900">Delete {request.name}?</h2>
      <p id="delete-description" className="mt-3 text-gray-600">Are you sure you want to delete this? You can cancel now to keep it.</p>
      <div className="mt-6 flex justify-end gap-3"><button ref={cancelRef} type="button" disabled={busy} onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 font-medium disabled:opacity-50">Cancel</button><button type="button" disabled={busy} onClick={() => { void request.onConfirm() }} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-50">{busy ? 'Deleting...' : 'Yes, delete'}</button></div>
    </div>
  </div>, document.body)
}

