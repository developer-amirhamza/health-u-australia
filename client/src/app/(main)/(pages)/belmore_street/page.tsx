import React from 'react'
import { Metadata } from 'next'
import BelmoreStreetClient from './BelmoreStreetClient'

export const metadata: Metadata = {
  title: "Belmore Street Ryde – NDIS SIL Housing",
  description: "3-bedroom NDIS SIL, STA, MTA and respite housing on Belmore Street, Ryde NSW 2112. Fully accessible with urgent placement available.",
}

const page = () => {
  return (
    <BelmoreStreetClient />
  )
}

export default page
