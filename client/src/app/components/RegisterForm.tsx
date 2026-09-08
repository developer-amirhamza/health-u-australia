"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import logo from 'assets/logo.png'
import { successAlert, errorAlert } from 'app/utils/alart'

type RegisterFormValues = {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

const RegisterForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const passwordValue = watch('password')

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    try {
      // TODO: Backend not implemented yet. Replace this simulated call with the
      // real registration API request once the endpoint is available.
      await new Promise((resolve) => setTimeout(resolve, 800))
      // eslint-disable-next-line no-console
      console.log('Register form submitted:', data)
      successAlert('Account created successfully!')
      router.push(`/welcome?name=${encodeURIComponent(data.fullName)}`)
    } catch {
      errorAlert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-secondary/10 via-white to-primary/10 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 sm:p-10">
        <Link href="/" className="mx-auto block w-40">
          <Image src={logo} alt="Health U Australia" className="mx-auto w-40" />
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold text-secondary-text">Create your account</h1>
        <p className="mt-1 text-center text-sm text-secondary-text/80">
          Join Health U Australia to manage your services online.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
          {/* Full name */}
          <div>
            <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-secondary-text">
              Full name
            </label>
            <div className="relative">
              <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                className={inputClass}
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Please enter your full name' },
                })}
              />
            </div>
            {errors.fullName && <p className="mt-1 text-xs text-primary">{errors.fullName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-secondary-text">
              Email address
            </label>
            <div className="relative">
              <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
                })}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-primary">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-secondary-text">
              Phone number
            </label>
            <div className="relative">
              <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="0400 000 000"
                className={inputClass}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+()\s-]{8,15}$/,
                    message: 'Enter a valid phone number',
                  },
                })}
              />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-primary">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-secondary-text">
              Password
            </label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={inputClass}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-text"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaRegEyeSlash size={15} /> : <FaRegEye size={15} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-primary">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-secondary-text">
              Confirm password
            </label>
            <div className="relative">
              <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className={inputClass}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === passwordValue || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-text"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <FaRegEyeSlash size={15} /> : <FaRegEye size={15} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-primary">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-sm text-secondary-text">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              {...register('acceptTerms', { required: 'You must accept the terms to continue' })}
            />
            <span>
              I agree to the{' '}
              <Link href="/non-ndis" className="font-medium text-primary hover:underline">
                Terms &amp; Conditions
              </Link>{' '}
              and Privacy Policy.
            </span>
          </label>
          {errors.acceptTerms && <p className="-mt-2 text-xs text-primary">{errors.acceptTerms.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-secondary-text">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
