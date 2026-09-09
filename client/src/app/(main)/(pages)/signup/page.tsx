"use client"
import React, { FormEvent, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import logo from 'assets/logo.png'
import Axios from 'utils/Axios'
import { SummeryApi } from 'app/common/SummeryApi'
import AxiosToastError from 'utils/AxiosToastError'

const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerms: false,
}

const ASSIGNABLE_ROLES = [
    { value: 'USER', label: 'User (Default)' },
    { value: 'CONSUMER', label: 'Consumer' },
    { value: 'TRADE', label: 'Trade Partners' },
    { value: 'RETAILER', label: 'Retailer' },
    { value: 'DISTRIBUTOR', label: 'Distributor' },
    { value: 'NDIS_COORDINATOR', label: 'NDIS/Aged Care Provider' },
];

const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

const SignUp = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter()

    const handleOnChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (!formData.acceptTerms) {
            toast.error("You must accept the Terms & Conditions to continue")
            return
        }
        try {
            setSubmitting(true)
            const { confirmPassword, acceptTerms, ...payload } = formData
            const response = await Axios({
                ...SummeryApi.signup,
                data: payload,
            });

            const responseData = response.data;
            if (responseData.success) {
                toast.success(responseData.message);
                // Email verification is mandatory before signing in — don't
                // auto-login here, send them to check their inbox instead.
                const signedUpEmail = formData.email
                setFormData(initialFormData)
                router.push(`/verify-email?email=${encodeURIComponent(signedUpEmail)}`)
            } else {
                toast.error(responseData.message)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setSubmitting(false)
        }
    }
    // Last name, mobile and role are optional; the rest are required.
    const validInput = Boolean(
        formData.firstName &&
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        formData.acceptTerms
    );

    return (
        <div className="flex min-h-[80vh] w-full items-center justify-center bg-linear-to-br from-secondary/10 via-white to-primary/10 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 sm:p-10">
                <Link href="/" className="mx-auto block w-40">
                    <Image src={logo} alt="Health U Australia" className="mx-auto w-40" />
                </Link>

                <h1 className="mt-6 text-center text-2xl font-bold text-secondary-text">Create your account</h1>
                <p className="mt-1 text-center text-sm text-secondary-text/80">
                    Join Health U Australia to manage your services online.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-secondary-text">
                                First name
                            </label>
                            <div className="relative">
                                <FaUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    id="firstName" name="firstName" type="text" autoComplete="given-name"
                                    placeholder="Jane" className={inputClass}
                                    value={formData.firstName} onChange={handleOnChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-secondary-text">
                                Last name
                            </label>
                            <input
                                id="lastName" name="lastName" type="text" autoComplete="family-name"
                                placeholder="Doe" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                                value={formData.lastName} onChange={handleOnChange}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-secondary-text">
                            Email address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                id="email" name="email" type="email" autoComplete="email"
                                placeholder="you@example.com" className={inputClass}
                                value={formData.email} onChange={handleOnChange}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-secondary-text">
                            Phone number
                        </label>
                        <div className="relative">
                            <FaPhoneAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                            <input
                                id="mobile" name="mobile" type="tel" autoComplete="tel"
                                placeholder="0400 000 000" className={inputClass}
                                value={formData.mobile} onChange={handleOnChange}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-secondary-text">
                            Password
                        </label>
                        <div className="relative">
                            <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                id="password" name="password" autoComplete="new-password"
                                placeholder="Enter your password" className={inputClass}
                                value={formData.password} onChange={handleOnChange}
                                type={showPassword ? "text" : "password"}
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
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-secondary-text">
                            Confirm password
                        </label>
                        <div className="relative">
                            <FaLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                id="confirmPassword" name="confirmPassword" autoComplete="new-password"
                                placeholder="Re-enter your password" className={inputClass}
                                value={formData.confirmPassword} onChange={handleOnChange}
                                type={showConfirm ? "text" : "password"}
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
                    </div>

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="mb-1 block text-sm font-medium text-secondary-text">
                            I am a...
                        </label>
                        <select
                            name="role" id="role" value={formData.role} onChange={handleOnChange}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-4 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                        >
                            {ASSIGNABLE_ROLES.map((role, idx) => (
                                <option key={idx} value={role.value}>{role.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2 text-sm text-secondary-text">
                        <input
                            type="checkbox" name="acceptTerms" checked={formData.acceptTerms}
                            onChange={handleOnChange}
                            className="mt-0.5 h-4 w-4 accent-primary"
                        />
                        <span>
                            I agree to the{' '}
                            <Link href="/contact-us" className="font-medium text-primary hover:underline">
                                Terms &amp; Conditions
                            </Link>{' '}
                            and Privacy Policy.
                        </span>
                    </label>

                    <button
                        disabled={!validInput || submitting} type="submit"
                        className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary-text">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-semibold text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
