import React from 'react'
import { Metadata } from 'next'
import PageBanner from 'app/utils/PageBanner'
import ParticipantFeedback from 'app/pages/ParticipantFeedback'

export const metadata: Metadata = {
  title: "Participant Feedback & Complaints",
  description: "Share a compliment, concern or complaint with Health U Australia. Learn about your rights and our NDIS complaints process.",
}

const page = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <PageBanner title='Participant Feedback' path='/participant-feedback' />
      <ParticipantFeedback />
    </div>
  )
}

export default page
