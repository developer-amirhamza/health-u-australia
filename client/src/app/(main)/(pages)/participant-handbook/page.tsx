import ParticipantHandbook from 'app/pages/ParticipantHandbook'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Participant Handbook | Your Rights, Supports & Services",
  description: "The Health U Australia Participant Handbook: our services, your rights and responsibilities, support planning, privacy, complaints and safeguarding for NDIS participants.",
};

const page = () => {
  return (
    <ParticipantHandbook />
  )
}

export default page
