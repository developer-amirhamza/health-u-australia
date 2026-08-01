import Capacity from 'app/pages/Capacity'
import { Metadata } from 'next'
import React from 'react'
export const metadata : Metadata = {
    title:"NDIS Capacity Building Support",
    description:"Maximise your potential with tailored NDIS capacity building support. Build skills, reach your goals and boost independence.",
}
const page = () => {
  return (
    <Capacity/>
  )
}

export default page