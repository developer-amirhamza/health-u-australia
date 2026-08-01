"use client"
import React from 'react'
import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { community_participation, } from 'config/page'
import Title from 'app/utils/Title';
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';

const CommunityContent = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Community Participation' path='/community-participation' />
            <div className="container px-5 flex flex-col gap-6 items-center mx-auto justify-center w-full h-full ">
                {community_participation.map((item, index) => (
                    <div key={index} className={`flex flex-col gap-x-8 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center items-start w-full`}>
                        <motion.div initial="hidden" whileInView={"show"} variants={fadeIn([0,2,4].includes(index) ? "right" : "left",0.2)}
                        className="flex w-full h-full">
                        <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center rounded-md  inset-0 items-start justify-start p-0 m-0 ' />
                        </motion.div>
                        <motion.div initial="hidden" whileInView={'show'} variants={fadeIn([0,2,4].includes(index) ? "left" : "right",0.2)}
                        className="flex flex-col w-full justify-center gap-2   ">
                            <Title title1={item.title1} title2={item.title2} />
                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1}</p>
                            <ul className="grid gap-2">
                                {item?.bullet_points && item?.bullet_points.map((itm, idx) => (
                                    <li key={idx} className=" flex items-start w-full gap-2 ">
                                        <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                        <p className="text-lg font-medium text-secondary-text ">{itm}</p>
                                    </li>
                                ))}
                                <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph2} </p>
                                {item.paragraph3 && <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph3}</p>}
                            </ul>
                        </motion.div>
                    </div>
                ))}

                <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("down",0.2)} className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <h2 className="text-3xl font-bold  ">It’s Time to Bravely Participate in Your Community!</h2>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        Bravely move forward to participate in your community, as we have got your back. <Link className='text-blue-600' href={"/contact"}> Get in touch</Link>  with our team to learn how they can make this possible.
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

export default CommunityContent