"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Dancing_Script } from 'next/font/google'

// Handwriting font for typed signatures
const handwriting = Dancing_Script({ subsets: ['latin'], weight: '500' })

interface SignaturePadProps {
  value?: string
  onChange: (dataUrl: string) => void
  label?: string
  error?: boolean
}

const SignaturePad = ({ value, onChange, label, error }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const hasDrawn = useRef(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [typing, setTyping] = useState(false)
  const [typed, setTyped] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(ratio, ratio)
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#171717'
    }
  }, [])

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true
    hasDrawn.current = true
    const ctx = canvasRef.current?.getContext('2d')
    const { x, y } = pointerPos(e)
    ctx?.beginPath()
    ctx?.moveTo(x, y)
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const { x, y } = pointerPos(e)
    ctx?.lineTo(x, y)
    ctx?.stroke()
  }

  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas && hasDrawn.current) {
      onChange(canvas.toDataURL('image/png'))
    }
  }

  // Attach a signature instead of drawing one: the image is fitted onto the
  // pad and saved as PNG, the same as a drawn signature.
  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!file || !canvas || !ctx || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const { width: w, height: h } = canvas.getBoundingClientRect()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const sc = Math.min(w / img.width, h / img.height, 1)
        const dw = img.width * sc, dh = img.height * sc
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
        hasDrawn.current = true
        onChange(canvas.toDataURL('image/png'))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  // Typed signature: the name drawn in the handwriting font, saved as PNG like a drawn one
  const typeSignature = async (text: string) => {
    setTyped(text)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { width: w, height: h } = canvas.getBoundingClientRect()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const name = text.trim()
    if (!name) { hasDrawn.current = false; onChange(''); return }
    const family = handwriting.style.fontFamily
    try { await document.fonts.load(`48px ${family}`, name) } catch { /* fall back to cursive */ }
    let size = 48
    ctx.font = `${size}px ${family}, cursive`
    while (size > 16 && ctx.measureText(name).width > w - 24) { size -= 2; ctx.font = `${size}px ${family}, cursive` }
    ctx.fillStyle = '#171717'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(name, w / 2, h / 2)
    hasDrawn.current = true
    onChange(canvas.toDataURL('image/png'))
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      hasDrawn.current = false
      setTyped('')
      onChange('')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-secondary-text">
          {label}
        </label>
      )}
      <div
        className={`relative w-full max-w-md h-36 border rounded bg-white ${error ? 'border-primary' : 'border-neutral-300'
          }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        {!value && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-neutral-300 pointer-events-none select-none">
            Sign here
          </span>
        )}
      </div>
      <div data-pdf-hide="true" className="print:hidden flex gap-4">
        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          Clear signature
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          Upload signature image
        </button>
        <button
          type="button"
          onClick={() => setTyping(t => !t)}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          Type signature
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" hidden onChange={upload} />
      </div>
      {typing && (
        <input
          type="text"
          value={typed}
          onChange={e => typeSignature(e.target.value)}
          placeholder="Type your full name"
          maxLength={60}
          autoFocus
          data-pdf-hide="true"
          className="print:hidden w-full max-w-md border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      )}
    </div>
  )
}

export default SignaturePad
