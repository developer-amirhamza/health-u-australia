import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import career from "assets/images/career.png"
import ndis_logo from "assets/ndis-logo-img.png"
import logo from "assets/footer-logo-img.png";



// meta title & description for seo ranking
export const  metadata = {
    title:"Apply for a Position | Health U Australia Careers",
    description: "Join Health U Australia and build a rewarding career in disability support. Explore roles, growth opportunities, and apply today.",
};

const page = () => {
  return (
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
                        <Link href={"https://healthuaustralia.snapforms.com.au/form/career-request-to-health-u-australia"} className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto mt-6 items-center text-2xl flex gap-5 rounded-full shadow hover:bg-gray-100 transition">
                            Apply Now
                            <FaArrowRightLong />
                        </Link>
                    </section>
                </main>
  )
}

export default page