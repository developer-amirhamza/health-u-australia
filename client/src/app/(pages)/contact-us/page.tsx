import React from 'react'

import { Metadata } from 'next'
import Contact from 'app/pages/Contact'


export const metadata : Metadata = {
    title:"Contact us - Health U Australia",
    description:"Have a question or need support? Contact Health U AU to start your journey toward better health and wellness. Call 0481707758 or 0431377132.",
}
const page = () => {
  return (
    <Contact/>
  )
}

export default page