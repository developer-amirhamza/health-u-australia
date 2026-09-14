import React from 'react'
import { Metadata } from 'next'
import { baseUrl } from 'app/common/SummeryApi'

export const metadata: Metadata = {
  title: 'Contract Generator',
  description: 'Internal tool for preparing employment/contractor contracts.',
  robots: { index: false, follow: false },
}

const page = () => {
  const src = `/contract-generator.html?apiBase=${encodeURIComponent(baseUrl || '')}`
  return (
    <iframe
      src={src}
      title="Health U Contract Generator"
      className="w-full h-[calc(100vh-4rem)] border-0 block"
    />
  )
}

export default page
