"use client"

import React from 'react'
import PageBanner from 'utils/PageBanner'
import Image from 'next/image'
import { motion } from 'framer-motion';
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { ndis_items } from 'config/page';
import Title from 'utils/Title';
import { fadeIn } from 'app/variants';


const NDIS = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='NDIS Services' path='/ndis' />
            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className=" flex flex-col gap-12">
                    {ndis_items.map((item, index) => (
                        <div key={index} className={` flex flex-col  gap-x-8 ${[0, 2, 4].includes(index) ? "md:flex-row" : "md:flex-row-reverse"}  justify-center items-start  w-full`} >
                            <motion.div className="flex w-full h-full"
                                initial={{
                                    opacity: 0,
                                    x: [0, 2, 4].includes(index) ? -80 : 80,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    transition: {
                                        type: "tween",
                                        duration: 1,
                                        delay: 0.5,
                                        ease: [0.25, 0.25, 0.25, 0.75]
                                    }
                                }}
                            >
                                <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500 rounded-md  w-full h-full md:object-center inset-0 items-start justify-start p-0 my-5 ' />
                            </motion.div>
                            <motion.div className="flex flex-col w-full justify-center gap-2"
                                initial={{
                                    opacity: 0,
                                    x: [0, 2, 4].includes(index) ? 80 : -80,
                                    y: 0,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    transition: {
                                        type: "tween",
                                        delay: 0.5,
                                        duration: 1,
                                        ease: [0.25, 0.25, 0.25, 0.75]
                                    },
                                }}>
                                <Title title1={item.title1} title2={item.title2} />
                                <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1} </p>
                                <ul className="grid gap-2">
                                    <h4 className="text-xl my-3 text-secondary-text font-semibold">{item?.paragraph3} </h4>
                                    {item.bullet_points && item.bullet_points.map((itm, idx) => (
                                        <li key={idx} className=" flex items-start w-full gap-2 ">
                                            <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-6 max-w-6 mt-0.5 text-white ' />
                                            <p className=" text-xl text-secondary-text font-bold  ">{itm?.keyword}
                                                <span className="text-lg font-medium ">{itm?.text} </span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <motion.div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    "
                    variants={fadeIn("down", 0.3)}
                    initial={"hidden"}
                    whileInView={"show"}
                >
                    <h1 className="text-3xl font-bold  ">Contact us to Get an NDIS Service as Per Your Needs</h1>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" flex  text-lg text-secondary-text font-medium text-center ">
                        Call us or send us an email requesting an appointment, and we will get back to you as soon as possible.
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

export default NDIS