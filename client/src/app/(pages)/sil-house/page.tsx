import React from 'react'
import { Metadata } from 'next'
import SilHouse from 'app/pages/SilHouse'

export const metadata : Metadata = {
    title:"SIL House - Health U Australia Supported Independent Living (SIL) NSW",
    description:"Boost independence with Health U’s person-centered SIL program, offering 24/7 support and shared living in Ryde. Check eligibility and tour accessible residences.",
}
const page = () => {
  return (
    <SilHouse/>
  )
}

export default page