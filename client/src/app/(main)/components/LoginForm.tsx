"use client"
import React, { ChangeEvent, useState, FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import logo from 'assets/logo.png'
import { successAlert, errorAlert } from 'utils/alart'
import Axios from 'utils/Axios'
import { SummeryApi } from 'app/common/SummeryApi'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'app/redux/store'
import { fetchUser } from 'app/redux/slices/userSlices'
import toast from 'react-hot-toast'
import AxiosToastError from 'utils/AxiosToastError'


type LoginFormValues = {
  email: string
  password: string
  remember: boolean
}
 const initialFormData = {
  email:"",
  password:"",
 }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass ='w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-secondary-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30'

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch<AppDispatch>()


  const handleOnChange = (e:ChangeEvent<HTMLInputElement>)=>{
    const {name, value }= e.target;
    setFormData({
      ...formData,
      [name] : value
    })
  };


  const handleSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    try {
      setLoading(true);
      const response = await Axios({
        ...SummeryApi.signin,
        withCredentials:true,
        data: formData,
      });
      if(response?.data?.success){
        toast.success(response?.data?.message);

        localStorage.setItem("accessToken", response?.data?.data?.accessToken);
        localStorage.setItem("refreshToken", response?.data?.data?.refreshToken);

        dispatch(fetchUser())
        setFormData(initialFormData)
        setLoading(false)
        router.push("/welcome")
      }
    } catch (error:any) {
      if (error?.response?.data?.data?.code === "EMAIL_NOT_VERIFIED") {
                toast.error(error?.response?.data?.message || "Please verify your email first.");
                const unverifiedEmail = error.response.data.data.email || formData.email;
                router.push(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`);
                return;
            };
            AxiosToastError(error)
    }
  };

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isSubmitting },
  // } = useForm<LoginFormValues>({
  //   defaultValues: { email: '', password: '', remember: false },
  // })

  // const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
  //   try {
  //     // TODO: Backend not implemented yet. Replace this simulated call with the
  //     // real authentication API request once the endpoint is available.
  //     await new Promise((resolve) => setTimeout(resolve, 800))
  //     // eslint-disable-next-line no-console
  //     console.log('Login form submitted:', data)
  //     successAlert('Logged in successfully!')
  //     router.push('/welcome')
  //   } catch {
  //     errorAlert('Invalid email or password. Please try again.')
  //   }
  // }
   const validInput = Object.values(formData).every(el => el);

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-linear-to-br from-secondary/10 via-white to-primary/10 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5 sm:p-10">
        <Link href="/" className="mx-auto block w-40">
          <Image src={logo} alt="Health U Australia" className="mx-auto w-40" />
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold text-secondary-text">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-secondary-text/80">
          Log in to access your Health U Australia account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
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
                name='email'
                autoComplete="email"
                placeholder="you@example.com"
                className={inputClass}
                value={formData.email}
                onChange={handleOnChange}
                // {...register('email', {
                //   required: 'Email is required',
                //   pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
                // })}
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
                id="password"
                name='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                className={inputClass}
                value={formData?.password}
                onChange={handleOnChange}
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-secondary-text">
              <input type="checkbox" className="h-4 w-4 accent-primary"  />
              Remember me
            </label>
            <Link href="/contact-us" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <input
            type="submit"
            disabled={!validInput}
            value={loading ? "Processing.." : "Signin"}
            className="mt-2 w-full rounded-full bg-primary py-2.5 text-sm font-semibold uppercase text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          />
        </form>

        <p className="mt-6 text-center text-sm text-secondary-text">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
