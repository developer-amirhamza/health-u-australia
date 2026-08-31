import React from 'react'
import { Metadata } from 'next'
import ServiceAgreementForm from 'app/components/ServiceAgreementForm'

export const metadata: Metadata = {
  title: 'Service Agreement Tool',
  description: 'Internal tool for preparing NDIS Service Agreement & Consent Form quotes.',
  robots: { index: false, follow: false },
}

const page = () => {
  return (
    <div>
      <div className="container mx-auto px-5 pt-10 text-center max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-text mb-4">Service Agreement Tool</h1>
        <p className="text-secondary-text text-lg font-medium">
          Internal staff tool for preparing a client&apos;s NDIS Service Agreement and Schedule of
          Supports in one place, and downloading it as a client-ready PDF. This replaces manually
          copying quote figures from the calculator into Snapform.
        </p>
      </div>
      <ServiceAgreementForm />
    </div>
  )
}

export default page
