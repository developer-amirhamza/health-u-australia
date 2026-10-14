import React from 'react'
import { Metadata } from 'next'
import ParticipantFeedback from './FeedbackView'

export const metadata: Metadata = {
  title: "Participant Feedback & Complaints",
  description: "Share a compliment, concern or complaint with Health U Australia. Learn about your rights and our NDIS complaints process.",
}

const page = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <ParticipantFeedback />
    </div>
  )
}

export default page
