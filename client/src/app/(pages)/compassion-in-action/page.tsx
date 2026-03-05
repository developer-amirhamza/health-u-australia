import React from 'react'
import { Metadata } from 'next';
import Compassion from 'app/pages/Compassion';


export const metadata : Metadata = {
    title:"Compassionate Support for Non-NDIS | Tailored Care Solutions",
    description:"Discover compassionate support for Non-NDIS individuals. Tailored care solutions to meet your needs with dignity and empathy.",
}
const page = () => {
  return (
    <Compassion />
  )
}

export default page