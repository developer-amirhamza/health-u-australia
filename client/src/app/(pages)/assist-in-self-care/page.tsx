import React from 'react'
import { Metadata } from 'next'
import AssistInSelf from 'app/pages/AssistInSelf';



export const metadata : Metadata = {
    title:"Professional Assist in Self Care Support | Health U Australia",
    description:"We provide comprehensive assist in self care services to promote independence and well-being. Contact us now. Call 0481707758 or 0431377132.",
};
const page = () => {
  return (
    <AssistInSelf/>
  )
}

export default page