"use client"
import React, { useEffect, useRef } from 'react'

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

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      hasDrawn.current = false
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
      <button
        type="button"
        onClick={clear}
        className="print:hidden self-start text-xs font-semibold text-primary hover:underline cursor-pointer"
      >
        Clear signature
      </button>
    </div>
  )
}

export default SignaturePad
