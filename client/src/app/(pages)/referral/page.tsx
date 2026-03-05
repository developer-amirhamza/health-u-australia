import Referral from 'app/pages/Referral'
import { Metadata } from 'next'
import React from 'react'

export const metadata : Metadata = {
    title:"Submit a Referral | Health U Support Services NDIS Form",
    description:"Ready to start with Health U? Fill out the secure NDIS referral form with participant details and service needs. This begins your personalized support journey. We’ll contact you soon.",
};
const page = () => {
  return (
    <Referral/>
  )
}

export default page