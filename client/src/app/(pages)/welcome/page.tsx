import React, { Suspense } from 'react'
import { Metadata } from 'next'
import WelcomeContent from 'app/components/WelcomeContent'

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Welcome to Health U Australia.',
  robots: { index: false, follow: false },
}

const page = () => {
  return (
    <Suspense>
      <WelcomeContent />
    </Suspense>
  )
}

export default page
