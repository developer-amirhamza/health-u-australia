import NDIS from 'app/pages/NDIS'
import { Metadata } from 'next'
import React from 'react'


export const metadata : Metadata = {
  title:"NDIS Service Sydney | NDIS Provider | NDIS Service Provider",
  description:"Looking for a trusted NDIS Service Provider? Get personalised care and NDIS support from certified NDIS providers today. We are the best NDIS provider in Sydney.",
};
const page = () => {
  return (
    <NDIS/>
  )
}

export default page