import React from 'react'
import { Metadata } from 'next'
import NormanhurstClient from './NormanhurstClient'

export const metadata: Metadata = {
  title: "Normanhurst NDIS Accessible Housing",
  description: "Fully accessible 4-bedroom NDIS SIL home on Denman Parade, Normanhurst NSW 2076, wheelchair friendly with ample parking.",
}

const page = () => {
  return (
    <NormanhurstClient />
  )
}

export default page
