import NDIS from 'app/pages/NDIS'
import { Metadata } from 'next'
import React from 'react'


export const metadata : Metadata = {
  title:"NDIS Service Provider Sydney",
  description:"Looking for a trusted NDIS service provider? Get personalised care and support from certified NDIS providers in Sydney today.",
};
const page = () => {
  return (
    <NDIS/>
  )
}

export default page