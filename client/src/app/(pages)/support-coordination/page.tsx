"use client"
import React from 'react'
import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { support_coordination, } from 'config/page'
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';

const SupportCoordination = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Support Coordination' path='/support-coordination' />
            <div className="container px-5 flex gap-8 flex-col items-center mx-auto justify-center w-full h-full ">
                {support_coordination.map((item, index) => (
                    <div key={index} className={`flex flex-col gap-x-10 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center items-start w-full`}>
                        <motion.div variants={fadeIn([0,2,4].includes(index) ? "right":"left",0.2)} initial="hidden" whileInView={"show"}
                        className="flex w-full h-full">
                        <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center inset-0 items-start justify-start p-0 m-0 ' />
                        </motion.div>
                        <motion.div variants={fadeIn([0,2,4].includes(index) ? "left":"right",0.2)} initial="hidden" whileInView={"show"}
                        className="flex flex-col w-full justify-center gap-2    ">
                            <h1 className="text-[27px] font-bold  ">{item.title1} <span className="text-secondary">{item.title2}</span></h1>
                            <div className='w-14 h-0.75 bg-primary items-center  ' />
                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item?.paragraph1}</p>
                            <ul className="grid gap-2">
                                {/* {item?.bullet_title && <h4 className="text-xl my-3 text-secondary-text font-semibold">{item?.bullet_title} </h4>} */}
                                {item?.bullet_points && item?.bullet_points.map((itm, idx) => (
                                    <li key={idx} className=" flex items-start w-full gap-2 ">
                                        <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                        <p className="text-lg font-medium text-secondary-text "><strong>{itm?.keyword} </strong>{itm?.text}</p>
                                    </li>
                                ))}
                                <h1 className="text-[27px] font-bold  ">{item?.title3} <span className="text-secondary">{item?.title4}</span></h1>
                                <p className="text-lg text-secondary-text font-medium my-2">{item?.paragraph2} </p>
                                {/* {item?.paragraph3 && <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph3}</p>} */}
                            </ul>
                        </motion.div>
                    </div>
                ))}

                <motion.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView={"show"}
                className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <h1 className="text-3xl font-bold  ">Reach Out to Us Today!</h1>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        If you want to learn more about support coordination and how our team can help you achieve your goals, <a className='text-blue-600' href="tel:0481 707 758">Call now</a> to book an appointment. For more queries, send an email, and we will reply to you soon.
                    </p>
                    <div className="flex items-center justify-center gap-10">
                        <Link href={"/contact-us"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Enquire Now</Link>
                        <Link href={"/referral"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Referral</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default SupportCoordination