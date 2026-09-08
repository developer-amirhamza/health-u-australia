import React from 'react'
import { Metadata } from 'next'
import DisabilitySupportWorkerClient from './DisabilitySupportWorkerClient'

export const metadata: Metadata = {
  title: "Disability Support Worker – Ryde/Hornsby",
  description: "Apply for a Disability Support Worker role (nursing background) in Ryde, Hornsby and Northern Districts NSW with Health U Australia.",
}

const page = () => {
  return (
    <DisabilitySupportWorkerClient />
  )
}

export default page
