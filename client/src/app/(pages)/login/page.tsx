import React from 'react'
import { Metadata } from 'next'
import LoginForm from 'app/components/LoginForm'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your Health U Australia account.',
  robots: { index: false, follow: false },
}

const page = () => {
  return <LoginForm />
}

export default page
