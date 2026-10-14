export default function PageLoader({ label, compact = false }: { label: string; compact?: boolean }) {
  return <div role="status" aria-label={label} className={`flex items-center justify-center ${compact ? 'min-h-40' : 'min-h-[50vh]'} w-full`}>
    <span className="h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-primary" aria-hidden="true" />
    <span className="sr-only">{label}</span>
  </div>
}
