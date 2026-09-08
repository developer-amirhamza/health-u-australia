import CareerSnapForm from 'app/components/CareerSnapForm'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Career Application Form",
  description: "Submit your job application to join the Health U Australia team using our secure online career application form.",
}

const page = () => {
  return (
    <div>
      <div className="container mx-auto px-5 pt-10 text-center max-w-3xl">
        <h1 className="text-3xl font-bold text-secondary-text mb-4">Career Application Form</h1>
        <p className="text-secondary-text text-lg font-medium">
          Ready to join the Health U Australia team? Fill out the application form below with your
          details, experience and the role you're applying for, and our recruitment team will be in
          touch to discuss the next steps.
        </p>
      </div>
      <CareerSnapForm/>
    </div>
  )
}

export default page