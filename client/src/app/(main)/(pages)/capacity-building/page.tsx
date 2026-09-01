import Capacity from 'app/pages/Capacity'
import { Metadata } from 'next'
import React from 'react'
export const metadata : Metadata = {
    title:"Capacity Building NDIS Services | NDIS Capacity Building Support",
    description:"Maximize your potential with NDIS capacity building support. Discover tailored NDIS capacity building services to help you reach goals. Build skills and boost independence.",
}
const page = () => {
  return (
    <Capacity/>
  )
}

export default page