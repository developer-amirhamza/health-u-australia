import PastEvents from 'app/pages/PastEvents'
import { Metadata } from 'next'
import React from 'react'

export const metadata : Metadata = {
    title:"Past Wellness Events",
    description:"Explore our archive of impactful events at Health U Australia. From wellness workshops to fitness sessions, relive the best moments with us.",
}
const page = () => {
  return (
    <PastEvents/>
  )
}

export default page