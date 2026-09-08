import React from 'react'
import { Metadata } from 'next'
import SupportCoordinationClient from './SupportCoordinationClient'

export const metadata: Metadata = {
  title: "Support Coordination Services",
  description: "Get expert NDIS support coordination in Sydney to connect you with services, manage your plan, and build lasting independence.",
}

const page = () => {
  return (
    <SupportCoordinationClient />
  )
}

export default page
