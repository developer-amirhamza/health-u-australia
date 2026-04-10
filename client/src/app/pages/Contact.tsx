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

const Contact = () => {
    const [state, handleSubmit] = useForm("xnjbvngz");
    const contactFormRef = useRef<HTMLFormElement>(null);
    const jobFormRef = useRef<HTMLFormElement>(null);
    const handleJobSubmit = (e: any) => {
        e.preventDefault();
        try {
            const form = e.currentTarget as HTMLFormElement;
            const name = (form.querySelector('input[name="name"]') as HTMLInputElement)?.value || '';
            const applicationFor = (form.querySelector('input[name="application_for"]') as HTMLInputElement)?.value || '';
            const subjectInput = form.querySelector('input[name="_subject"]') as HTMLInputElement | null;
            if (subjectInput) subjectInput.value = `New Job Application from ${name} for ${applicationFor}`;
            if (state.succeeded) {
                successAlert("Thank you for submission!")
                jobFormRef.current?.reset();
            }
        } catch (err) {
            errorAlert("Your submission has been failed!")
        }
        return handleSubmit(e);
    };
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
            <div className="flex flex-col  w-full h-full mx-auto my-12 ">
                <div className="flex px-10  flex-wrap items-center justify-center w-full gap-5 my-12 h-full">
                    {contact_details.map((item, index) => (
                        <div key={index} className="flex w-full max-w-100 border-[0.5px] border-neutral-300 rounded-md min-h-136 items-start  shadow-2xl">
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
                    <div className="grid gap-5 w-full rounded border border-neutral-400 shadow p-5">
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact