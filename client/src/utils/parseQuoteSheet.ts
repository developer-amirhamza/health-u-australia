// Reads an "NDIS Support Quote Calculator" export (.csv, or the .xlsx workbook)
// into the Service Agreement's Schedule of Supports: the quote information
// (Quote Number:, Participant Name:, ... — each label with its value in the next
// cell) and the support item rows under the "Item Code" header.

export type ImportedQuoteItem = {
  itemCode: string
  itemName: string
  unitPrice: number
  frequency: string
  dayOfWeek: string
  hoursPerService: number
  qtyPerPeriod: number
  startDate: string
  endDate: string
  notes: string
}

export type ImportedQuote = {
  quoteNumber: string
  quoteDate: string
  participantName: string
  participantNdisNumber: string
  planStartDate: string
  planEndDate: string
  preparedBy: string
  contactPerson: string
  items: ImportedQuoteItem[]
}

type Cell = string | number | boolean | Date | null | undefined

const text = (v: Cell) => (v instanceof Date ? '' : String(v ?? '').trim())

const pad = (n: number) => String(n).padStart(2, '0')

// To the yyyy-mm-dd a date input takes. Text dates are read day first
// (Australian), unless the second part can only be a day (10/16/2026).
const toIsoDate = (v: Cell): string => {
  if (v instanceof Date && !Number.isNaN(v.getTime()))
    return `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}`
  const s = text(v)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/)
  if (!m) return ''
  let a = +m[1], b = +m[2]
  const y = m[3].length === 2 ? 2000 + +m[3] : +m[3]
  if (b > 12 && a <= 12) [a, b] = [b, a]
  if (a < 1 || a > 31 || b < 1 || b > 12) return ''
  return `${y}-${pad(b)}-${pad(a)}`
}

const toNumber = (v: Cell) => {
  if (typeof v === 'number') return v
  const n = parseFloat(text(v).replace(/[$,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// the value beside a label such as "Quote Number:"
const labelValue = (rows: Cell[][], label: string): Cell => {
  const want = norm(label)
  for (const r of rows)
    for (let c = 0; c < r.length; c++) if (norm(text(r[c])) === want) return r[c + 1]
  return ''
}

const pick = (value: string, options: string[], fallback: string) =>
  options.find((o) => o.toLowerCase() === value.toLowerCase()) || fallback

export const parseQuoteRows = (
  rows: Cell[][],
  opts: { frequencies: string[]; days: string[] }
): ImportedQuote | null => {
  // the support items header: the first row with both "Item Code" and "Item Name"
  const h = rows.findIndex((r) => {
    const n = r.map((c) => norm(text(c)))
    return n.includes('itemcode') && n.includes('itemname')
  })
  if (h < 0) return null
  const head = rows[h].map((c) => norm(text(c)))
  const col = (...names: string[]) => head.findIndex((x) => names.includes(x))
  const C = {
    code: col('itemcode'), name: col('itemname'), price: col('unitprice'), shared: col('sharedwith'),
    freq: col('frequency'), day: col('dayofweek', 'day'), hours: col('hoursservice', 'hours'),
    qty: col('qtyperperiod', 'qty'), start: col('startdate'), end: col('enddate'), notes: col('notes'),
  }
  const at = (r: Cell[], i: number): Cell => (i >= 0 ? r[i] : '')

  const items: ImportedQuoteItem[] = []
  for (const r of rows.slice(h + 1)) {
    const code = text(at(r, C.code))
    // the items end at the first row without an item code (or a formula error)
    if (!code || code.startsWith('#')) break
    const shared = text(at(r, C.shared))
    const notes = [text(at(r, C.notes)), shared && !/^no ?one$/i.test(shared) ? `Shared with ${shared}` : '']
      .filter(Boolean).join('; ')
    items.push({
      itemCode: code,
      itemName: text(at(r, C.name)),
      unitPrice: toNumber(at(r, C.price)),
      frequency: pick(text(at(r, C.freq)), opts.frequencies, opts.frequencies[0]),
      dayOfWeek: pick(text(at(r, C.day)), opts.days, opts.days[0]),
      hoursPerService: toNumber(at(r, C.hours)),
      qtyPerPeriod: toNumber(at(r, C.qty)),
      startDate: toIsoDate(at(r, C.start)),
      endDate: toIsoDate(at(r, C.end)),
      notes,
    })
  }
  if (!items.length) return null

  const top = rows.slice(0, h)
  return {
    quoteNumber: text(labelValue(top, 'Quote Number:')),
    quoteDate: toIsoDate(labelValue(top, 'Quote Date:')),
    participantName: text(labelValue(top, 'Participant Name:')),
    participantNdisNumber: text(labelValue(top, 'NDIS Number:')),
    planStartDate: toIsoDate(labelValue(top, 'Plan Start Date:')),
    planEndDate: toIsoDate(labelValue(top, 'Plan End Date:')),
    preparedBy: text(labelValue(top, 'Prepared By:')),
    contactPerson: text(labelValue(top, 'Contact:')),
    items,
  }
}

// Reads the file and returns the first sheet that holds a quote.
export const parseQuoteFile = async (
  file: File,
  opts: { frequencies: string[]; days: string[] }
): Promise<ImportedQuote | null> => {
  const XLSX = await import('xlsx')
  const isCsv = /\.csv$/i.test(file.name) || file.type === 'text/csv'
  const wb = isCsv
    // raw keeps CSV cells as typed, so dates are not guessed as US month-first
    ? XLSX.read(await file.text(), { type: 'string', raw: true })
    : XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true })
  for (const name of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json<Cell[]>(wb.Sheets[name], { header: 1, raw: true, defval: '' })
    const q = parseQuoteRows(rows, opts)
    if (q) return q
  }
  return null
}
