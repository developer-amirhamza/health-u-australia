"use client"
import React, { useEffect, useRef, useState } from 'react'
import { docStyles } from 'app/common/contractDocStyles'

// Lays a contract's documentHtml out on real A4 pages, so the preview and the
// PDF show the same pages and no line of text is cut across a page boundary.
//
// Pages are 210 × 297 mm at 96 dpi with the generator tool's print margins
// (@page margin 16mm 15mm). Blocks that don't fit move to the next page; long
// blocks (clause lists, clauses, the details table, the signature block) are
// split between their children, and headings are kept with what follows.

export const PAGE_W = 794
export const PAGE_H = 1123
const PAD_Y = 60
const PAD_X = 57
const CONTENT_H = PAGE_H - PAD_Y * 2

export const pageStyles = `
.hu-contract-page{width:${PAGE_W}px;height:${PAGE_H}px;padding:${PAD_Y}px ${PAD_X}px;box-sizing:border-box;background:#fff;position:relative;overflow:hidden}
.hu-contract-page .doc{display:flow-root}
.hu-contract-page .doc>:first-child{margin-top:0}
.hu-contract-page .doc ol.cl>li::before{content:none}
.hu-contract-page .doc ol.cl>li>.cln{position:absolute;left:0;top:0;font-weight:700}
.hu-contract-page .doc li.hu-cont{list-style:none}
.hu-contract-page .doc .hu-cont>:first-child{margin-top:0}
.hu-contract-page .doc .sig.hu-cont{margin-top:0;border-top:0;padding-top:0}
.hu-contract-page .doc table.hu-cont{margin-top:0}
.hu-contract-page .pgno{position:absolute;right:${PAD_X}px;bottom:24px;font-family:var(--font);font-size:8pt;color:#9aa0ab}
`

const allStyles = docStyles + pageStyles

const SPLITTABLE = 'ol.cl, ol.cl > li, ul.sub, ol.sub, table.det, table.det > tbody, .sig'
const isSplittable = (n: Node): n is Element => n instanceof Element && n.matches(SPLITTABLE)

// Headings, and the lines of a signature block, stay with what follows them.
const keepsWithNext = (el: Element) => {
  const next = el.nextElementSibling
  if (!next) return false
  if (/^H[1-6]$/.test(el.tagName) || el.matches('b.ct, .conf')) return true
  if (el.matches('p') && next.matches('.sigline')) return true
  if (el.matches('.sigline')) {
    return next.matches('.sigline') || (next.matches('p') && next === el.parentElement?.lastElementChild)
  }
  return false
}

const keepGroup = (el: Element) => {
  const group = [el]
  while (keepsWithNext(group[group.length - 1])) group.push(group[group.length - 1].nextElementSibling!)
  return group
}

// The smallest leading part of `el` that may sit at the bottom of a page.
const minChunk = (el: Element): Element => {
  if (!isSplittable(el) || !el.firstElementChild) return el.cloneNode(true) as Element
  const shell = el.cloneNode(false) as Element
  const group = keepGroup(el.firstElementChild)
  group.forEach((g, i) => shell.appendChild(i === group.length - 1 ? minChunk(g) : g.cloneNode(true)))
  return shell
}

const hasContent = (el: Element) => Boolean(el.textContent?.trim()) || Boolean(el.querySelector('img'))

const wrapPage = (content: string, index: number, total: number) =>
  `<div class="hu-contract-page"><div class="doc">${content}</div>`
  + `<div class="pgno">Page ${index + 1} of ${total}</div></div>`

// An off-screen host carrying the document styles, for measuring and capture.
const createHost = () => {
  const host = document.createElement('div')
  host.className = 'hu-contract-doc'
  host.style.cssText = `position:absolute;left:-10000px;top:0;width:${PAGE_W}px`
  host.innerHTML = `<style>${allStyles}</style>`
  document.body.appendChild(host)
  return host
}

const settle = async (el: HTMLElement) => {
  await (document as any).fonts?.ready
  await Promise.all(Array.from(el.querySelectorAll('img')).map(img =>
    img.complete ? null : new Promise(resolve => { img.onload = img.onerror = resolve })))
}

// Splits documentHtml into the inner HTML of each A4 page.
export const paginateContract = async (html: string): Promise<string[]> => {
  const host = createHost()
  try {
    const source = document.createElement('div')
    source.innerHTML = html
    // Numbered so a list continued on the next page keeps counting.
    source.querySelectorAll('ol.cl, ol.sub').forEach(ol =>
      Array.from(ol.children).forEach((li, i) => li.setAttribute('data-n', String(i + 1))))

    const pages: HTMLElement[] = []
    let root!: HTMLElement
    const newPage = () => {
      const page = document.createElement('div')
      page.className = 'hu-contract-page'
      root = document.createElement('div')
      root.className = 'doc'
      page.appendChild(root)
      host.appendChild(page)
      pages.push(root)
    }
    newPage()
    await settle(host)

    const fits = () => {
      const last = root.lastElementChild
      if (!last) return true
      return last.getBoundingClientRect().bottom - root.getBoundingClientRect().top <= CONTENT_H + 0.5
    }
    const fitsWith = (parent: Element, nodes: Node[]) => {
      nodes.forEach(n => parent.appendChild(n))
      const ok = fits()
      nodes.forEach(n => parent.removeChild(n))
      return ok
    }
    const pageEmpty = () => !hasContent(root)

    // Starts a new page, re-opening the elements in `chain` (marked as continued).
    const breakPage = (chain: Element[]) => {
      newPage()
      let parent: Element = root
      for (const el of chain) {
        const shell = el.cloneNode(false) as Element
        shell.classList.add('hu-cont')
        shell.setAttribute('data-shell', '')
        parent.appendChild(shell)
        parent = shell
      }
      return parent
    }

    // Each returns the element, on the current page, that the next sibling goes into.
    const place = (node: Node, parent: Element, chain: Element[]): Element => {
      const clone = node.cloneNode(true)
      parent.appendChild(clone)
      if (fits()) return parent
      parent.removeChild(clone)
      if (isSplittable(node) && (pageEmpty() || fitsWith(parent, [minChunk(node)]))) {
        const shell = node.cloneNode(false) as Element
        shell.setAttribute('data-shell', '')
        parent.appendChild(shell)
        return placeChildren(node, shell, [...chain, node]).parentElement!
      }
      if (pageEmpty()) {
        // Taller than a page and can't be split: let it overflow rather than loop.
        parent.appendChild(clone)
        return parent
      }
      return place(node, breakPage(chain), chain)
    }

    const placeChildren = (src: Element, target: Element, chain: Element[]): Element => {
      let cur = target
      for (const child of Array.from(src.childNodes)) {
        if (child instanceof Element && !pageEmpty()) {
          if (child.classList.contains('brk')) {
            cur = breakPage(chain)
          } else {
            const group = keepGroup(child)
            const test = group.map((g, i) => i === group.length - 1 ? minChunk(g) : g.cloneNode(true))
            if (group.length > 1 && !fitsWith(cur, test)) cur = breakPage(chain)
          }
        }
        cur = child instanceof Element || child.textContent?.trim()
          ? place(child, cur, chain)
          : (cur.appendChild(child.cloneNode(true)), cur)
      }
      return cur
    }

    placeChildren(source, root, [])

    return pages.map(page => {
      // Drop continuation shells left empty, deepest first.
      Array.from(page.querySelectorAll('[data-shell]')).reverse().forEach(el => {
        if (!hasContent(el)) el.remove()
        else el.removeAttribute('data-shell')
      })
      // Clause numbers as real text — html2canvas doesn't lay out ::before the
      // way the browser does — and none on a clause continued from the last page.
      page.querySelectorAll('ol.cl > li[data-n]:not(.hu-cont)').forEach(li => {
        const n = document.createElement('span')
        n.className = 'cln'
        n.textContent = `${li.getAttribute('data-n')}.`
        li.prepend(n)
      })
      page.querySelectorAll('ol.sub').forEach(ol => {
        const n = ol.firstElementChild?.getAttribute('data-n')
        if (n) ol.setAttribute('start', n)
      })
      return page.innerHTML
    }).filter(content => content.trim())
  } finally {
    host.remove()
  }
}

// The parts of Tailwind's preflight the contract layout depends on. Pages are
// measured on the site (preflight applied), so the PDF render needs them too.
const PREFLIGHT = `
*,::before,::after{box-sizing:border-box;margin:0;padding:0;border:0 solid}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
ol,ul{list-style:none}
img{display:block;vertical-align:middle;max-width:100%;height:auto}
table{text-indent:0;border-color:inherit;border-collapse:collapse}
b,strong{font-weight:bolder}
`

const SCALE = 2

// Renders one page as an SVG image, so the browser lays the text out itself
// in an isolated document — no site CSS, no extensions, and no per-word
// re-drawing as in html2canvas (which can run words together when its copy
// of the page doesn't get the same font).
const rasterizePage = (pageHtml: string) => new Promise<string>((resolve, reject) => {
  const wrap = document.createElement('div')
  wrap.className = 'hu-contract-doc'
  wrap.style.cssText = `width:${PAGE_W}px;height:${PAGE_H}px;background:#fff`
  wrap.innerHTML = `<style>${PREFLIGHT}${allStyles}</style>${pageHtml}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_W * SCALE}" height="${PAGE_H * SCALE}" viewBox="0 0 ${PAGE_W} ${PAGE_H}">`
    + `<foreignObject x="0" y="0" width="${PAGE_W}" height="${PAGE_H}">${new XMLSerializer().serializeToString(wrap)}</foreignObject></svg>`
  const img = new Image()
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = PAGE_W * SCALE
      canvas.height = PAGE_H * SCALE
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      // Throws where the browser treats the canvas as tainted (older Safari).
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    } catch (err) { reject(err) }
  }
  img.onerror = () => reject(new Error('Could not render the page image'))
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
})

// Fallback where SVG rendering isn't allowed. html2canvas-pro (not
// html2canvas): Tailwind v4's oklch() colors.
const html2canvasPages = async (pages: string[]) => {
  const { default: html2canvas } = await import('html2canvas-pro')
  const host = createHost()
  try {
    host.insertAdjacentHTML('beforeend', pages.map((p, i) => wrapPage(p, i, pages.length)).join(''))
    await settle(host)
    const images: string[] = []
    for (const el of Array.from(host.querySelectorAll<HTMLElement>('.hu-contract-page'))) {
      const canvas = await html2canvas(el, {
        scale: SCALE, useCORS: true, backgroundColor: '#ffffff', width: PAGE_W, height: PAGE_H,
      })
      images.push(canvas.toDataURL('image/jpeg', 0.95))
    }
    return images
  } finally {
    host.remove()
  }
}

// Captures each page at A4 size into a PDF — one PDF page per preview page.
export const buildContractPdf = async (pages: string[]) => {
  const { default: jsPDF } = await import('jspdf')
  let images: string[]
  try {
    images = []
    for (let i = 0; i < pages.length; i++) images.push(await rasterizePage(wrapPage(pages[i], i, pages.length)))
  } catch (err) {
    console.warn('Contract PDF: SVG rendering unavailable, using html2canvas', err)
    images = await html2canvasPages(pages)
  }
  const pdf = new jsPDF('p', 'mm', 'a4')
  images.forEach((img, i) => {
    if (i > 0) pdf.addPage()
    pdf.addImage(img, 'JPEG', 0, 0, 210, 297)
  })
  return pdf
}

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2]
const VIEWER_PAD = 16

// The paginated preview, shown like a PDF reader: A4 pages on a dark backdrop,
// a page counter and zoom. Zoom only scales the pages — the layout on each
// page (and so the PDF) is the same at any width.
export const ContractPages = ({ html, onPages, height = '75vh' }: {
  html: string
  onPages?: (pages: string[]) => void
  height?: string
}) => {
  const [pages, setPages] = useState<string[] | null>(null)
  const [fitScale, setFitScale] = useState(1)
  const [zoom, setZoom] = useState<number | null>(null) // null = fit width
  const [current, setCurrent] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const onPagesRef = useRef(onPages)
  onPagesRef.current = onPages
  const scale = zoom ?? fitScale

  useEffect(() => {
    let alive = true
    setPages(null)
    paginateContract(html).then(result => {
      if (!alive) return
      setPages(result)
      setCurrent(1)
      onPagesRef.current?.(result)
    })
    return () => { alive = false }
  }, [html])

  // Fit width: as large as the viewer allows, never above 100%.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => setFitScale(Math.min(1, (el.clientWidth - VIEWER_PAD * 2) / PAGE_W))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The page counter follows whichever page fills the middle of the viewer.
  const onScroll = () => {
    const el = scrollRef.current
    if (!el || !pages) return
    const mid = el.scrollTop + el.clientHeight / 2
    const pageH = PAGE_H * scale + VIEWER_PAD
    setCurrent(Math.min(pages.length, Math.max(1, Math.floor((mid - VIEWER_PAD) / pageH) + 1)))
  }

  const stepZoom = (dir: 1 | -1) => {
    const next = dir > 0 ? ZOOM_STEPS.find(z => z > scale + 0.01) : [...ZOOM_STEPS].reverse().find(z => z < scale - 0.01)
    if (next) setZoom(next)
  }

  const btn = 'h-7 min-w-7 px-2 rounded text-sm text-white/90 hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default'

  return (
    <div className="hu-contract-doc w-full rounded-md overflow-hidden bg-[#525659] shadow-inner">
      <style jsx global>{allStyles}</style>
      <div className="flex items-center justify-between gap-2 bg-[#323639] text-white/90 px-3 h-10 text-sm select-none">
        <span className="tabular-nums whitespace-nowrap">
          {pages ? <>Page {current} / {pages.length}</> : 'Preparing…'}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" className={btn} onClick={() => stepZoom(-1)} disabled={!pages || scale <= ZOOM_STEPS[0] + 0.01} aria-label="Zoom out">−</button>
          <span className="w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
          <button type="button" className={btn} onClick={() => stepZoom(1)} disabled={!pages || scale >= ZOOM_STEPS[ZOOM_STEPS.length - 1] - 0.01} aria-label="Zoom in">+</button>
          <button type="button" className={`${btn} ml-1 ${zoom === null ? 'bg-white/15' : ''}`} onClick={() => setZoom(null)} title="Fit width">Fit</button>
        </div>
      </div>
      <div ref={scrollRef} onScroll={onScroll} className="overflow-auto" style={{ height }}>
        {!pages ? (
          <div className="py-16 text-center text-sm text-white/70">Preparing pages…</div>
        ) : (
          <div className="flex flex-col items-center w-max min-w-full" style={{ padding: VIEWER_PAD, gap: VIEWER_PAD }}>
            {pages.map((content, i) => (
              <div
                key={i}
                className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.45)] overflow-hidden shrink-0"
                style={{ width: PAGE_W * scale, height: PAGE_H * scale }}
              >
                <div
                  style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: PAGE_W }}
                  dangerouslySetInnerHTML={{ __html: wrapPage(content, i, pages.length) }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
