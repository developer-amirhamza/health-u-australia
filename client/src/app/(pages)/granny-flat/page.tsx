import React from 'react'
import { Metadata } from 'next'
import GrannyFlatClient from './GrannyFlatClient'

export const metadata: Metadata = {
  title: "Ryde NDIS Granny Flat – SIL Housing",
  description: "Fully accessible 2-bedroom NDIS granny flat SIL housing on Belmore Street, Ryde NSW 2112, ideal for independent or shared living.",
}

const page = () => {
  return (
    <GrannyFlatClient />
  )
}

export default page
