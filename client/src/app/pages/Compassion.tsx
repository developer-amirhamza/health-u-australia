"use client"
import React from 'react'
import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image';
import Link from 'next/link';
import compassion_in_action1 from "assets/images/compassion/compassion-in-action-img01.png"
import compassion_in_action2 from "assets/images/compassion/compassion-in-action-img02.jpg"
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';

const Compassion = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Compassion In Action' path='/compassion-in-action' />
            <div className="container max-md:px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className="flex flex-col md:flex-row-reverse my-12 gap-x-10 w-full">
                    <div className="flex flex-col w-full h-full md:max-w-lg overflow-hidden items-center justify-center gap-12">
                        <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("right", 0.3)} viewport={{once:false,amount:0.3}} className="flex w-full h-full">
                            <Image src={compassion_in_action1} alt='compassion in action'
                            className='object-cover w-full h-full inset-0 hover:scale-103  duration-500 transition-all ease-in-out rounded-md' />
                        </motion.div>
                        <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("right", 0.3)} viewport={{once:false,amount:0.3}} className="flex w-full h-full">
                            <Image src={compassion_in_action2} alt='compassion in action'
                            className='object-cover w-full h-full inset-0 hover:scale-103  duration-500 transition-all ease-in-out rounded-md' />
                        </motion.div>
                    </div>
                    {/* images section end */}
                    <div className="flex flex-col w-full justify-center gap-10     ">
                        <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}} className="grid gap-4">
                            <h2 className="text-[32px] font-bold  ">Compassion in Action<span className="text-secondary"> For Non NDIS Participants</span></h2>
                            <div className='w-14 h-0.75 bg-primary items-center  ' />
                        </motion.div>
                        <motion.p initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}} className="  w-full text-lg text-secondary-text font-medium  ">At Health U, we believe that no one should feel left behind when they face short-term challenges in daily life.
                            That’s why we created the <strong>Compassion in Action (CIA) Program</strong> – a community-driven initiative designed to bridge the gap for individuals who need immediate,
                            practical support but may not be eligible for, or currently connected with, government-funded services such as NDIS, My Aged Care, Carer Gateway, or ComPacks.</motion.p>
                        <motion.p initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}} className="  w-full text-lg text-secondary-text font-medium  ">The Compassion in Action Program provides <strong>short-term, affordable support</strong> to people who are experiencing difficulties managing essential daily tasks due to health conditions, sudden life changes, or lack of informal support. Our goal is to respond quickly, with kindness and dignity,
                            so that people can continue to live safely and independently while regaining stability.</motion.p>
                        <motion.ul initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}} className="grid gap-2 list-disc">
                            <h4 className="text-xl my-3 text-secondary-text font-semibold">Through CIA, our team offers hands-on assistance such as:</h4>
                            <li className=" flex items-start  w-full gap-2 list-disc ">
                                <div className='bg-secondary-text rounded-full mt-2.5 text-4xl  h-full w-full max-h-2 max-w-2  text-white ' />
                                <p className="text-lg font-medium text-secondary-text "><strong>Domestic support</strong>  – light cleaning of bedrooms, bathrooms, and toilets.</p>
                            </li>
                            <li className=" flex items-start  w-full gap-2 list-disc ">
                                <div className='bg-secondary-text rounded-full mt-2.5 text-4xl  h-full w-full max-h-2 max-w-2  text-white ' />
                                <p className="text-lg font-medium text-secondary-text ">
                                    <strong>Transport</strong>  – to attend medical appointments, visit family or friends, or access the community.</p>
                            </li>
                            <li className=" flex items-start  w-full gap-2 list-disc ">
                                <div className='bg-secondary-text rounded-full mt-2.5 text-4xl  h-full w-full max-h-2 max-w-2  text-white ' />
                                <p className="text-lg font-medium text-secondary-text ">
                                    <strong>Personal care</strong>  – showering and dressing assistance.</p>
                            </li>
                            <li className=" flex items-start  w-full gap-2 list-disc ">
                                <div className='bg-secondary-text rounded-full mt-2.5 text-4xl  h-full w-full max-h-2 max-w-2  text-white ' />
                                <p className="text-lg font-medium text-secondary-text ">
                                    <strong>Meal preparation</strong>  – preparing meals or providing a freshly cooked lunch.</p>
                            </li>
                            <li className=" flex items-start  w-full gap-2 list-disc ">
                                <div className='bg-secondary-text rounded-full mt-2.5 text-4xl  h-full w-full max-h-2 max-w-2  text-white ' />
                                <p className="text-lg font-medium text-secondary-text ">
                                    <strong>Social support</strong>  – companionship and engagement to reduce isolation.</p>
                            </li>
                            {/* <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph2} </p> */}
                        </motion.ul>

                        <motion.p initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}}
                         className="  w-full text-lg text-secondary-text font-medium  ">We understand that every situation is unique, so each request is carefully assessed to ensure the service we provide matches the person’s needs and our available resources. The program is not government funded and operates entirely through our privately funded capacity.
                            For this reason, CIA is delivered as an <strong>affordable paid service,</strong> with a small fee in place to make it sustainable while ensuring our limited resources are reserved for those in genuine need.</motion.p>

                        <motion.p initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}}
                        className="  w-full text-lg text-secondary-text font-medium  ">CIA is a <strong>short-term, stop-gap service</strong> rather than ongoing care. By offering this, we aim to provide a safety net at critical times and, where appropriate, guide individuals towards longer-term supports within the wider community.</motion.p>
                        <motion.p  initial="hidden" whileInView={"show"} variants={fadeIn("left", 0.3)} viewport={{once:false,amount:0.3}}
                        className=" flex w-full text-lg text-secondary-text font-medium  ">The Compassion in Action Program is more than just a service – it’s a reflection of our values. It represents our commitment to stand alongside people when they feel most vulnerable,
                            offering not only practical help but also a reminder that they are not alone</motion.p>
                    </div>
                </div>

                <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("down", 0.3)} viewport={{once:false,amount:0.3}} className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <div className="flex items-center justify-center gap-10">
                        <Link href={"/contact-us"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Enquire Now</Link>
                        <Link href={"/referral"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Referral</Link>
                    </div>
                </motion.div>


            </div>
        </div>
    )
}

export default Compassion