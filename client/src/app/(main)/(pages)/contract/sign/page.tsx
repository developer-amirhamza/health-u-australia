"use client"
import React, { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { SummeryApi } from 'app/common/SummeryApi'
import { docStyles } from 'app/common/contractDocStyles'
import Axios from 'utils/Axios'
import SignaturePad from 'app/(main)/components/SignaturePad'

interface SignableContract {
  employeeName: string
  contractType: string
  position: string
  documentHtml: string
}

const SignContent = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contract, setContract] = useState<SignableContract | null>(null)
  const [alreadySigned, setAlreadySigned] = useState(false)
  const [justSigned, setJustSigned] = useState(false)

  const [signature, setSignature] = useState('')
  const [fullName, setFullName] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('This link is missing its signing token.')
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const response = await Axios({ ...SummeryApi.getContractByToken, params: { token } })
        if (response.data?.success) {
          setContract(response.data.data?.contract)
          setFullName(response.data.data?.contract?.employeeName || '')
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

  const submit = async () => {
    if (!signature || !fullName.trim() || !accepted) {
      setShowErrors(true)
      toast.error('Please sign, enter your full name and confirm you accept the contract')
      return
    }
    try {
      setSubmitting(true)
      const response = await Axios({
        ...SummeryApi.submitEmployeeSignature,
        data: { token, employeeSignature: signature, employeeSignatureName: fullName.trim(), accepted },
      })
      if (response.data?.success) setJustSigned(true)
      else toast.error(response.data?.message || 'Could not submit your signature')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Could not submit your signature')
    } finally {
      setSubmitting(false)
    }
  }

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
          <h1 className="text-xl font-bold text-secondary-text mb-2">Can&apos;t open this contract</h1>
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
              : 'This contract has already been signed. No further action is needed.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-2xl font-bold text-secondary-text mb-2">Review and sign your contract</h1>
      <p className="text-secondary-text/80 mb-6">
        Please read the contract below carefully, then add your signature at the bottom of this page.
      </p>

      <style jsx global>{docStyles}</style>
      <div className="hu-contract-doc">
        <div className="bg-white border border-neutral-200 rounded p-5 sm:p-8 overflow-x-auto">
          <div className="doc" dangerouslySetInnerHTML={{ __html: contract?.documentHtml || '' }} />
        </div>
      </div>

      <div className="mt-8 bg-white border border-neutral-200 rounded p-5 sm:p-8 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-secondary-text">Your signature</h2>

        <SignaturePad value={signature} onChange={setSignature} label="Signature" error={showErrors && !signature} />

        <div className="flex flex-col gap-2 max-w-md">
          <label htmlFor="fullName" className="text-sm font-semibold text-secondary-text">Full name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            maxLength={120}
            className={`border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${showErrors && !fullName.trim() ? 'border-primary' : 'border-neutral-300'}`}
          />
        </div>

        <label className={`flex items-start gap-2 text-sm ${showErrors && !accepted ? 'text-primary' : 'text-secondary-text'}`}>
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1" />
          <span>I have read and understood this contract and accept it on the terms and conditions set out in it.</span>
        </label>

        <p className="text-xs text-secondary-text/70">Today&apos;s date is added automatically when you submit.</p>

        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="self-start text-white cursor-pointer text-sm font-semibold px-6 py-2.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Sign contract'}
        </button>
      </div>
    </div>
  )
}

const ContractSignPage = () => (
  <Suspense fallback={null}>
    <SignContent />
  </Suspense>
)

export default ContractSignPage
