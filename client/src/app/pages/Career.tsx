"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import career from "assets/images/career.png"
import ndis_logo from "assets/ndis-logo-img.png"
import logo from "assets/footer-logo-img.png";
import { career_infographic, career_jobs } from 'config/page'
import { SiTicktick } from 'react-icons/si'
import { useRouter } from 'next/navigation'

const Career = () => {
  const router = useRouter();
  return (
    <main className="bg-white text-gray-800">
                        {/* hero image */}
                        <section className="flex w-full  items-center bg-amber-100 justify-center mx-auto">
                            {/* <Image src={career} alt='career' /> */}
                            <div className="container flex flex-wrap gap-5 items-center  justify-center w-full ">
                                {career_infographic.map((item,index)=>(
                                    <div key={index} className="flex bg-amber-50 max-w-2/12  shadow items-center w-full justify-between flex-col gap-2 scale-100
                                    hover:scale-105 rounded-xl py-2 duration-300 cursor-pointer">
                                        <Image src={item?.icon} alt={item.label} className=' flex max-w-40 max-h-32' />
                                        <span className="text-2xl font-bold"> {item.label} </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* HERO */}
                        <section className="bg-linear-150 from-secondary/15 to-primary/15 text-black py-16 px-6 text-center grid gap-10">
                            <h1 className="text-4xl md:text-5xl text-secondary font-bold mb-4">
                            <span className='text-primary'> Apply for a</span> Position
                            </h1>
                            <p className="max-w-2xl mx-auto text-lg">
                                Join Health U Australia and build a career that truly makes a
                                difference in people's lives.
                            </p>
                            {/* current jobs */}
                            <div  className="flex flex-col md:flex-row items-start justify-center gap-10  ">
                                {career_jobs.map((item:any,index:any)=>(
                                <Link href={`/career/${item?.id}`} key={index} className=" shadow-2xl py-10 rounded-md max-w-sm items-center min-h-107 scale-100 hover:scale-105
                                justify-between bg-red-50 p-2 gap-3 flex flex-col cursor-pointer duration-300 transition-transform text-neutral-800 ">
                                    <h1 className="text-xl font-bold text-secondary-text  ">{item.title}</h1>
                                    <span className="text-secondary-text   font-medium ">{item.publish_date} </span>
                                    <ul className="flex flex-col gap-2 mb-2 items-start justify-center px-4 text-secondary-text  ">
                                        {item.keywords.map((itm:any,idx:number)=>(
                                            <div key={idx} className="flex gap-3 items-center font-semibold justify-start text-start">
                                                <SiTicktick size={15} />
                                                <li key={idx} className=" w-full  ">{itm}</li>
                                            </div>
                                        ))}
                                    </ul>
                                    <button onClick={()=> router.push(`/career/${item?.id}`)}
                                    className='cursor-pointer transition-all duration-300 hover:bg-primary px-5 py-2.5 hover:text-white text-primary font-semibold rounded-full border  border-primary' >Job Details</button>
                                </Link>
                            ))}
                            </div>

                            <Link href={"https://healthuaustralia.snapforms.com.au/form/career-request-to-health-u-australia"} className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto mt-6 items-center text-2xl flex gap-5 rounded-full shadow hover:bg-gray-100 transition">
                                Apply Now
                                <FaArrowRightLong />
                            </Link>
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

                        </section>
        </main>
  )
}

export default Career