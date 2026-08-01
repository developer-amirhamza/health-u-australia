import React from 'react'
import { Metadata } from 'next'
import DomesticCleanerClient from './DomesticCleanerClient'

export const metadata: Metadata = {
  title: "Domestic Cleaner Job – Northern Beaches",
  description: "Apply for a casual Domestic Cleaner role in the lower North Shore and Northern Beaches areas of NSW with Health U Australia.",
}

const page = () => {
  return (
    <DomesticCleanerClient />
  )
}

export default page
