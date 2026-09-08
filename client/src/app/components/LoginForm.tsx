"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import logo from 'assets/logo.png'
import { successAlert, errorAlert } from 'app/utils/alart'

type LoginFormValues = {
  email: string
  password: string
  remember: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '', remember: false },
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      // TODO: Backend not implemented yet. Replace this simulated call with the
      // real authentication API request once the endpoint is available.
      await new Promise((resolve) => setTimeout(resolve, 800))
      // eslint-disable-next-line no-console
      console.log('Login form submitted:', data)
      successAlert('Logged in successfully!')
      router.push('/welcome')
    } catch {
      errorAlert('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-br from-secondary/10 via-white to-primary/10 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 sm:p-10">
        <Link href="/" className="mx-auto block w-40">
          <Image src={logo} alt="Health U Australia" className="mx-auto w-40" />
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold text-secondary-text">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-secondary-text/80">
          Log in to access your Health U Australia account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
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
                autoComplete="current-password"
                placeholder="Your password"
                className={inputClass}
                {...register('password', { required: 'Password is required' })}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-secondary-text">
              <input type="checkbox" className="h-4 w-4 accent-primary" {...register('remember')} />
              Remember me
            </label>
            <Link href="/contact-us" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-secondary-text">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
