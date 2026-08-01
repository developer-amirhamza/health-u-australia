import React from 'react'
import { Metadata } from 'next'
import BowdenStreetClient from './BowdenStreetClient'

export const metadata: Metadata = {
  title: "Bowden Street Ryde – NDIS SIL Housing",
  description: "3-bedroom NDIS SIL, STA, MTA and respite housing on Bowden Street, Ryde NSW 2112. Accessible home with urgent placement available.",
}

const page = () => {
  return (
    <BowdenStreetClient />
  )
}

export default page
