import React from 'react'
import { Metadata } from 'next'
import RegisterForm from 'app/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Health U Australia account to manage your NDIS services online.',
  robots: { index: false, follow: false },
}

const page = () => {
  return <RegisterForm />
}

export default page
