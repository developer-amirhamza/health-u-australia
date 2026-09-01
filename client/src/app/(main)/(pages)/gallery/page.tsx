import React from 'react'
import { Metadata } from 'next'
import Gallery from 'app/pages/Gallery'


export const metadata : Metadata = {
    title:"Gallery of Wellness Inspiration – Health U Australia",
    description:"Explore our gallery filled with inspiring visuals of health programs and vibrant wellness experiences.",
}
const page = () => {
  return (
    <Gallery/>
  )
}

export default page