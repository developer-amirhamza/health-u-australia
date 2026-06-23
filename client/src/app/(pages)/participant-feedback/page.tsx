import ParticipantFeedbackForm from 'app/components/ParticipantFeedbackForm'
import PageBanner from 'app/utils/PageBanner'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "NDIS Participant Feedback | Health U Support Services",
  description: "Share your feedback with Health U Australia. Your experience matters — help us improve our NDIS support services by completing the participant feedback form.",
};

const page = () => {
  return (
    <>
      <PageBanner title='Participant Feedback' path='/participant-feedback' />
      <ParticipantFeedbackForm />
    </>
  )
}

export default page