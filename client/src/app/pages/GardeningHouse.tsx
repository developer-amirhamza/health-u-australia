"use client";

import React from 'react'
import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { gardening_house_yard } from 'config/page'
import Title from 'app/utils/Title';
import { motion } from "framer-motion";
import { fadeIn } from 'app/variants';

const GardeningHouse = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Gardening/House And Yard Maintenance' path='/gardening-house-yard' />
            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className="grid gap-10 w-full h-full">
                    {gardening_house_yard.map((item, index) => (
                    <div key={index} className={`flex flex-col gap-x-10 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} gap-10 justify-center items-start w-full`}>
                        <motion.div initial={{
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
                                    ease: [0.25, 0.25, 0.25, 0.25]
                                }
                            }}
                            viewport={{ once: false, amount: 0.5 }}
                            className="items-start justify-start p-0 m-0 flex w-full h-full">
                            <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center rounded-md  inset-0  ' />
                        </motion.div>
                        <motion.div className="flex flex-col w-full justify-center gap-2   "
                            initial={{
                                opacity: 0,
                                x: [0, 2, 4].includes(index) ? -80 : 80,
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
                                    ease: [0.25, 0.25, 0.25, 0.25]
                                }
                            }}
                            viewport={{ once: false, amount: 0.5 }}
                        >
                            <Title title1={item.title1} title2={item.title2} />
                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1}</p>
                            <ul className="grid gap-2">
                                {item?.bullet_points && <h4 className="text-xl my-3 text-secondary-text font-semibold">{item.bullet_title} </h4>}
                                {item?.bullet_points && item?.bullet_points.map((itm: any, idx: number) => (
                                    <li key={idx} className=" flex items-start w-full gap-2 ">
                                        <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                        <p className="text-lg font-medium text-secondary-text ">{itm?.text}</p>
                                    </li>
                                ))}
                                <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph2} </p>
                            </ul>
                        </motion.div>
                    </div>
                ))}
                </div>


                <motion.div variants={fadeIn("down",0.2)} initial="hidden" whileInView={"show"}
                className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <h2 className="text-3xl font-bold  ">Make an Appointment with Us</h2>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" flex  text-lg text-secondary-text font-medium text-center ">
                        Get in touch with us now to opt for our exceptional SIL assistance and get started attaining independence and cheerfulness in life.
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

export default GardeningHouse