"use client"
import { SummeryApi } from 'app/common/SummeryApi';


import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'app/redux/store';
import resendVerificationEmail from 'utils/resendVerificationEmail';
import { portalPath } from 'utils/roles';
import { fetchUser } from 'app/redux/slices/userSlices';

const VerifyEmailContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [otp, setOtp] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        if (!email) {
            toast.error("Enter your email first.");
            return;
        }
        try {
            setResending(true);
            const data = await resendVerificationEmail(email);
            toast.success(data?.message || "Verification code sent.");
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setResending(false);
        }
    }

    const handleVerify = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setVerifying(true);
            const response = await Axios({
                ...SummeryApi.verifyEmail,
                data: { email, otp },
                withCredentials: true,
            });
            if (response.data.success) {
                toast.success(response.data.message);
                // Verifying signs the user in (same as sign-in) — store the
                // tokens and go straight to their portal.
                localStorage.setItem("accessToken", response?.data?.data?.accessToken);
                localStorage.setItem("refreshToken", response?.data?.data?.refreshToken);
                dispatch(fetchUser());
                const role = response?.data?.data?.user?.role;
                router.push(portalPath(role));
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setVerifying(false);
        }
    }

    const validInput = Boolean(email && otp.length === 6);

    return (
        <section className='w-full min-h-screen h-full bg-no-repeat bg-center'>
            <div className="container px-5 mx-auto flex w-full justify-center py-6">
                <div className="  shadow-2xl p-10 flex justify-center items-center w-full max-w-md h-full flex-col rounded-md gap-5 text-center">
                    <h1 className="text-2xl text-text uppercase font-semibold">Verify your email</h1>
                    <p className="text-text-hover text-base">
                        Enter the 6-digit code we sent to your email address. It expires in 10 minutes.
                    </p>
                    <form onSubmit={handleVerify} className="grid gap-4 w-full text-lg text-left">
                        <div className="grid gap-2">
                            <label htmlFor="email" className="font-medium text-text-hover">Email:</label>
                            <input
                                className='w-full font-medium text-text p-2 outline-none border-2 border-secondary rounded focus-within:border-text'
                                value={email}
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                name="email"
                                id="email"
                                placeholder='Enter your email'
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="otp" className="font-medium text-text-hover">Verification code:</label>
                            <input
                                className='w-full font-medium text-text p-2 outline-none border-2 border-secondary rounded focus-within:border-text text-center tracking-[0.5em]'
                                value={otp}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                name="otp"
                                id="otp"
                                placeholder='000000'
                            />
                        </div>
                        <input disabled={!validInput || verifying} type="submit" value={verifying ? "Verifying.." : "Verify email"}
                            className={`${validInput ? "bg-secondary-hover text-white cursor-pointer hover:bg-secondary" : "bg-primary-hover cursor-not-allowed"} p-2 text-secondary
                                  text-xl font-semibold rounded`} />
                    </form>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="text-sm font-semibold text-secondary hover:underline disabled:opacity-60"
                    >
                        {resending ? "Sending…" : "Didn't get a code? Resend it"}
                    </button>
                    <Link href={"/signin"} className='text-xl font-bold text-secondary hover:underline'>Back to sign in</Link>
                </div>
            </div>
        </section>
    )
}

const VerifyEmail = () => (
    <Suspense fallback={null}>
        <VerifyEmailContent />
    </Suspense>
)

export default VerifyEmail