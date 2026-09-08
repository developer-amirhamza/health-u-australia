import React from 'react'
import { Metadata } from 'next'
import SilHouse from 'app/pages/SilHouse'

export const metadata : Metadata = {
    title:"SIL House – Supported Independent Living NSW",
    description:"Boost independence with our person-centred SIL program, offering 24/7 support and shared living in Ryde. Check eligibility today.",
}
const page = () => {
  return (
    <SilHouse/>
  )
}

export default page