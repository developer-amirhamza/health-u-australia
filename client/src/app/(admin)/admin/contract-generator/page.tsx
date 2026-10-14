import React from 'react'
import { Metadata } from 'next'
import { baseUrl } from 'app/common/SummeryApi'

export const metadata: Metadata = {
  title: 'Contract Generator',
  description: 'Internal tool for preparing employment/contractor contracts.',
  robots: { index: false, follow: false },
}

// ?edit=<contract id> (from Admin → Contracts) reopens a submitted contract for editing
const page = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const { edit } = await searchParams
  const editId = typeof edit === 'string' ? edit : ''
  const src = `/contract-generator.html?apiBase=${encodeURIComponent(baseUrl || '')}`
    + (editId ? `&edit=${encodeURIComponent(editId)}` : '')
  return (
    <iframe
      src={src}
      title="Health U Contract Generator"
      className="w-full h-[calc(100vh-4rem)] border-0 block"
    />
  )
}

export default page
