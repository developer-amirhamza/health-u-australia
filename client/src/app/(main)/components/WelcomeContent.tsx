"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'
import logo from 'assets/logo.png'

const NEXT_STEPS = [
  {
    title: 'Explore our services',
    body: 'Browse NDIS supports including SIL, support coordination, community access and daily living assistance.',
    href: '/ndis',
    cta: 'View services',
  },
  {
    title: 'Make a referral',
    body: 'Refer yourself or someone you support to start receiving services from our team.',
    href: '/referral',
    cta: 'Start a referral',
  },
  {
    title: 'Get in touch',
    body: 'Have a question? Our team is here to help you get set up and answer anything you need.',
    href: '/contact-us',
    cta: 'Contact us',
  },
]

const WelcomeContent = () => {
  const searchParams = useSearchParams()
  const name = searchParams.get('name')?.trim()
  const firstName = name ? name.split(' ')[0] : ''

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-secondary/10 via-white to-primary/10 px-4 py-16">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5 sm:p-12">
        <Link href="/" className="mx-auto block w-44">
          <Image src={logo} alt="Health U Australia" className="mx-auto w-44" />
        </Link>

        <FaCheckCircle className="mx-auto mt-8 text-secondary" size={48} />

        <h1 className="mt-4 text-3xl font-bold text-secondary-text">
          Welcome{firstName ? `, ${firstName}` : ' to Health U Australia'}!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-secondary-text/80">
          Your account is ready. Here are a few things you can do next to get the most out of Health U
          Australia.
        </p>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
          {NEXT_STEPS.map((step) => (
            <div
              key={step.title}
              className="flex flex-col rounded-xl border border-gray-100 bg-gray-50/60 p-5"
            >
              <h2 className="text-sm font-semibold text-secondary-text">{step.title}</h2>
              <p className="mt-1 flex-1 text-xs text-secondary-text/75">{step.body}</p>
              <Link
                href={step.href}
                className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
              >
                {step.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-secondary sm:w-auto"
          >
            Go to homepage
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold uppercase text-secondary-text transition hover:border-primary hover:text-primary sm:w-auto"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomeContent
