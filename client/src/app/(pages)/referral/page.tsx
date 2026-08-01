
import SnapForm from 'app/components/SnapForm';
import Referral from 'app/pages/Referral'
import { Metadata } from 'next'
import React from 'react'

export const metadata : Metadata = {
    title:"Submit a Referral – NDIS Form",
    description:"Fill out our secure NDIS referral form with participant details and service needs to begin your personalised support journey with us.",
};
const page = () => {
  return (
    // <Referral/>
    <SnapForm/>
  )
}

export default page