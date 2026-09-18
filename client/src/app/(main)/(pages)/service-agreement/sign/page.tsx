"use client"
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SummeryApi } from 'app/common/SummeryApi'
import Axios from 'utils/Axios'
import ServiceAgreementForm from 'app/(main)/components/ServiceAgreementForm'

const SignContent = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [agreement, setAgreement] = useState<any>(null)
  const [alreadySigned, setAlreadySigned] = useState(false)
  const [justSigned, setJustSigned] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('This link is missing its signing token.')
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const response = await Axios({ ...SummeryApi.getServiceAgreementByToken, params: { token } })
        if (response.data?.success) {
          setAgreement(response.data.data?.agreement)
          setAlreadySigned(Boolean(response.data.data?.alreadySigned))
        } else {
          setError(response.data?.message || 'This signing link is invalid or has expired.')
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'This signing link is invalid or has expired.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-secondary-text">
        Loading…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-secondary-text mb-2">Can&apos;t open this agreement</h1>
          <p className="text-secondary-text/80">{error}</p>
          <Link href="/" className="inline-block mt-6 text-primary font-semibold hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    )
  }

  if (alreadySigned || justSigned) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-secondary-text mb-2">Thank you</h1>
          <p className="text-secondary-text/80">
            {justSigned
              ? 'Your signature has been submitted. Health U Australia has been notified.'
              : 'This agreement has already been signed. No further action is needed.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <ServiceAgreementForm mode="sign" initialData={agreement} token={token} onSigned={() => setJustSigned(true)} />
  )
}

const ServiceAgreementSignPage = () => (
  <Suspense fallback={null}>
    <SignContent />
  </Suspense>
)

export default ServiceAgreementSignPage
