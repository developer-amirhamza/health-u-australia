import React from 'react'
import { Metadata } from 'next'
import HomeModification from 'app/pages/HomeModification';


export const metadata : Metadata = {
    title:"NDIS Home Modifications & Accessibility Solutions in Sydney",
    description:"Enhance your home with NDIS home modifications and accessibility features. Professional services for improved independence and mobility.",
};
const page = () => {
  return (
    <HomeModification/>
  )
}

export default page