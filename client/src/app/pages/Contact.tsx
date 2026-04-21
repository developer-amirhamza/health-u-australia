"use client"

import { useForm, ValidationError } from '@formspree/react'
import Button from 'app/utils/Button'
import PageBanner from 'app/utils/PageBanner'
import { errorAlert, successAlert } from 'app/utils/alart'
import Title from 'app/utils/Title'
import { contact_details } from 'config/page';
import { LuPhoneCall } from 'react-icons/lu'
import { MdOutlineMail } from 'react-icons/md'
import { PiMapPinAreaBold } from 'react-icons/pi'
import { TbClockHour3 } from 'react-icons/tb';
import { useRef } from 'react'
import Image from 'next/image'
import career from "assets/images/career.png"
import ndis_logo from "assets/ndis-logo-img.png"
import logo from "assets/footer-logo-img.png";
import Link from 'next/link'
import { FaArrowRightLong } from 'react-icons/fa6'

const Contact = () => {
    const [state, handleSubmit] = useForm("xnjbvngz");
    const contactFormRef = useRef<HTMLFormElement>(null);
    // const jobFormRef = useRef<HTMLFormElement>(null);
    // const handleJobSubmit = (e: any) => {
    //     e.preventDefault();
    //     try {
    //         const form = e.currentTarget as HTMLFormElement;
    //         const name = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || '';
    //         const applicationFor = (form.querySelector('input[name="application_for"]') as HTMLInputElement)?.value || '';
    //         const subjectInput = form.querySelector('input[name="_subject"]') as HTMLInputElement | null;
    //         if (subjectInput) subjectInput.value = `New Job Application from ${name} for ${applicationFor}`;
    //         if (state.succeeded) {
    //             successAlert("Thank you for submission!")
    //             jobFormRef.current?.reset();
    //         }
    //     } catch (err) {
    //         errorAlert("Your submission has been failed!")
    //     }
    //     return handleSubmit(e);
    // };
    const handleContactSubmit = (e: any) => {
        e.preventDefault();
        try {
            const form = e.currentTarget as HTMLFormElement;
            const name = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || '';
            const subjectInput = form.querySelector('input[name="_subject"]') as HTMLInputElement | null;
            if (subjectInput) subjectInput.value = `New message from ${name}`;
            if (state.succeeded) {
                successAlert("Thank you for submission!")
                contactFormRef.current?.reset();
            }
        } catch (err) {
            errorAlert("Your submission has been failed!")
        }
        return handleSubmit(e);
    };
    return (
        <div className="grid w-full h-full">
            <PageBanner title='Contact Us' path='/contact-us' />
            <div className="flex flex-col  w-full h-full  my-12 ">
                <div className="flex px-10  flex-wrap  justify-center w-full gap-5 my-12    ">
                    {contact_details.map((item, index) => (
                        <div key={index} className="flex w-full max-w-100 border-[0.5px] border-neutral-300 rounded-md  items-start  shadow-2xl">
                            <ul>
                                <Title title1={item.title1} title2={item.title2} className={`p-5`} />
                                <li className="flex items-center p-5 gap-3">
                                    <div className="shadow-2xl shadow-black  h-12 flex items-center justify-center rounded-full w-12">
                                        <LuPhoneCall className='text-2xl text-primary ' />
                                    </div>
                                    <div className="grid gap-">
                                        <h1 className="text-xl font-semibold">Call Us</h1>
                                        <a className='text-secondary-text text-lg font-semibold' href={`tel:${item.phone}`}>{item.phone}</a>
                                    </div>
                                </li>
                                <li className="flex items-center p-5 gap-3">
                                    <div className="shadow-2xl shadow-black  h-12 flex items-center justify-center rounded-full w-12">
                                        <MdOutlineMail className='text-2xl text-primary ' />
                                    </div>
                                    <div className="grid ">
                                        <h1 className="text-2xl font-semibold">Email Us</h1>
                                        <a className='text-secondary-text text-lg font-semibold' href={`mailto:${item.email}`}>{item.email}</a>
                                    </div>
                                </li>
                                <li className="flex items-center p-5 gap-3">
                                    <div className="shadow-2xl shadow-black  h-12 flex items-center justify-center rounded-full w-12">
                                        <PiMapPinAreaBold className='text-2xl text-primary ' />
                                    </div>
                                    <div className="grid gap-3">
                                        <h1 className="text-2xl font-semibold">Address</h1>
                                        <address className=' text-secondary-text font-semibold '>{item?.address} </address>
                                    </div>
                                </li>
                                <li className="flex items-center p-5 gap-3">
                                    <div className="shadow-2xl shadow-black  h-12 flex items-center justify-center rounded-full w-12">
                                        <TbClockHour3 className='text-2xl text-primary ' />
                                    </div>
                                    <div className="grid gap-3">
                                        <h1 className="text-2xl font-semibold">Working Hour</h1>
                                        <span className=' text-secondary-text font-semibold '>{item?.time}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
                <main className="bg-white text-gray-800">


                    {/* hero image */}
                    <section className="flex w-full max-w-4xl items-center justify-center mx-auto">
                        <Image src={career} alt='career' />
                    </section>
                    {/* HERO */}
                    <section className="bg-linear-150 from-secondary/15 to-primary/15 text-black py-16 px-6 text-center">
                        <h1 className="text-4xl md:text-5xl text-secondary font-bold mb-4">
                           <span className='text-black'> Apply for a</span> Position
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg">
                            Join Health U Australia and build a career that truly makes a
                            difference in people's lives.
                        </p>
                    </section>

                    {/* WHY WORK WITH US */}
                    <section className="py-12 px-6 max-w-6xl mx-auto">
                        <h2 className="text-3xl font-semibold mb-6">Why Work With Us?</h2>
                        <p className="mb-4">
                            At Health U Australia, we are passionate about helping people every
                            day in every way. We are a trusted provider of premium disability
                            services, known for delivering high-quality, reliable, and
                            person-centred care.
                        </p>
                        <p>
                            We bridge the gap between disability support and mainstream medical
                            care, ensuring every individual receives the attention and expertise
                            they deserve.
                        </p>
                    </section>


                    {/* BENEFITS */}
                    <section className="bg-gray-50 py-12 px-6">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-semibold mb-6">What We Offer</h2>

                            <ul className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Competitive salary and benefits",
                                    "Ongoing training and development",
                                    "Supportive team environment",
                                    "Flexible working arrangements",
                                    "Career progression opportunities",
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="bg-white p-4 rounded-xl shadow-sm border"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* WHO WE'RE LOOKING FOR */}
                    <section className="py-12 px-6 max-w-6xl mx-auto">
                        <h2 className="text-3xl font-semibold mb-6">
                            Who We’re Looking For
                        </h2>

                        <ul className="grid md:grid-cols-2 gap-4">
                            {[
                                "Compassionate and empathetic individuals",
                                "Reliable and professional attitude",
                                "Passion for helping others",
                                "Willingness to learn and grow",
                                "Experience in disability support (preferred)",
                            ].map((item, index) => (
                                <li
                                    key={index}
                                    className="p-4 border rounded-xl shadow-sm"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* PROUDLY SUPPORTING */}
                    <section className="bg-gray-50 py-12 px-6">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl font-semibold mb-6">
                                Proudly Supporting
                            </h2>

                            <ul className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Disability support services",
                                    "Complex and high-intensity care",
                                    "Personalised care solutions",
                                    "Community participation",
                                ].map((item, index) => (
                                    <li
                                        key={index}
                                        className="bg-white p-4 rounded-xl shadow-sm border"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="py-16 px-6 text-center -bg-linear-150 from-secondary to-primary text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Start Your Career With Us
                        </h2>
                        <p className="mb-6">
                            Be part of a team that transforms lives through care.
                        </p>
                        <div className="flex w-full mx-auto justify-center items-center gap-6 rounded-2xl p-2 border max-w-max">
                            <Image src={ndis_logo} alt='Health U Australia ' className='  max-w-40 max-h-40 h-full p-0 m-0 w-full  flex  ' />
                            <Image src={logo} alt='Health U Australia' className='  max-w-30 max-h-20 h-full p-0 m-0 w-full  flex  ' />
                        </div>
                        <Link href={"/"} className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto mt-6 items-center text-2xl flex gap-5 rounded-full shadow hover:bg-gray-100 transition">
                            Apply Now
                            <FaArrowRightLong />
                        </Link>
                    </section>
                </main>
                <div className="flex container mx-auto px-0 flex-col md:flex-row items-center justify-center w-full shadow py-12 gap-10 ">
                    <div className="grid gap-5 w-full rounded border shadow border-neutral-400 p-5">
                        <Title title1='Get In Touch' title2='With Us' />
                        <form ref={contactFormRef} onSubmit={handleContactSubmit} className="grid gap-5 ">
                            <input type="hidden" name="_subject" value="New Contact Form Submission" />
                            <input
                                type="text"
                                name='name'
                                id='name'
                                placeholder='Enter Your Name'
                                required
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Name"
                                field="name"
                                errors={state.errors}
                            />
                            <input
                                type="text"
                                name='phone'
                                id='phone'
                                required
                                placeholder='Enter Your Phone'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Phone"
                                field="phone"
                                errors={state.errors}
                            />
                            <input
                                type="email"
                                name='email'
                                id='email'
                                required
                                placeholder='Enter Your Email'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Email"
                                field="email"
                                errors={state.errors}
                            />
                            <textarea name="message" id="message" placeholder='Write the message here! ' required rows={5}
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  "
                            />
                            <ValidationError
                                prefix="Message"
                                field="message"
                                errors={state.errors}
                            />
                            <button disabled={state.submitting} className='text-white cursor-pointer text-xl max-w-fit uppercase font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300' type="submit">Submit</button>
                        </form>
                    </div>
                    {/* <div className="grid gap-5 w-full rounded border border-neutral-400 shadow p-5">
                        <Title title1='Apply For' title2='a Position' />
                        <form ref={jobFormRef} onSubmit={handleJobSubmit} className="grid gap-5 ">
                            <input type="hidden" name="_subject" value="New Job Application from {name} for {application_for}" />
                            <input
                                type="text"
                                name='name'
                                id='name'
                                required
                                placeholder='Enter Your Name'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Name"
                                field="name"
                                errors={state.errors}
                            />
                            <input
                                type="text"
                                name='phone'
                                id='phone'
                                required
                                placeholder='Enter Your Phone'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Phone"
                                field="phone"
                                errors={state.errors}
                            />
                            <input
                                type="email"
                                name='email'
                                id='email'
                                required
                                placeholder='Enter Your Email'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Email"
                                field="email"
                                errors={state.errors}
                            />
                            <input
                                type="text"
                                name='application_for'
                                id='application_for'
                                placeholder='Application For'
                                className="text-neutral-500 border py-3 px-5 text-lg rounded  outline-none focus-within:border-secondary  " />
                            <ValidationError
                                prefix="Application_for"
                                field="application_for"
                                errors={state.errors}
                            />
                            <div className="grid gap-3">
                                <h1 className="text-xl font-semibold ">Upload Your CV</h1>
                                <div className="text-neutral-500 border py-3 px-5 text-lg rounded   focus-within:border-secondary">
                                    <input type="file" name="cv" id="cv" className='' required />
                                    <ValidationError
                                        prefix="Cv"
                                        field="cv"
                                        errors={state.errors}
                                    />
                                </div>
                            </div>
                            <button disabled={state.submitting} className='text-white cursor-pointer text-xl max-w-fit uppercase font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300' type="submit">Apply Now</button>
                        </form>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Contact