"use client"

import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import React from 'react'
import { PiMapPinAreaFill } from 'react-icons/pi';
import event_image from "assets/images/2026/09/event-img02.jpg";
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';

const CurrentEvents = () => {
    return (
        <div className="grid w-full h-full gap-12  ">
            <PageBanner title='Current Events' path='/current-events' />
            <div className="container mx-auto items-start w-full justify-center my-10 rounded border-neutral-300  gap-12 border text-secondary-text p-10 flex flex-col md:flex-row  ">
                <motion.div className="flex flex-col items-start text-lg w-full "
                initial="hidden" whileInView={"show"} variants={fadeIn('left',0.3)} viewport={{once:false,amount:0.2}}
                >
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">Recurring :</h1>
                        <p className=" text-secondary-text font-semibold text-sm ">Monthly Community BBQ: Held on the last Friday of each month</p>
                    </div>
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">FREE</h1>
                        <p className=" text-secondary-text font-semibold text-sm ">LAST FRIDAY OF EVERY MONTH</p>
                    </div>
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">BBQ Party</h1>
                        <p className=" text-secondary-text font-semibold text-sm ">Everyone Is Welcome Here</p>
                    </div>
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">FOOD | FRIENDS | FUN</h1>
                        <div className="flex items-center gap-2 text-secondary-text ">
                            <PiMapPinAreaFill size={30} className='text-primary' />
                            <p className=" text-secondary-text font-semibold text-sm ">Community Park</p>
                        </div>
                    </div>

                </motion.div>
                <motion.div className="flex w-full  "
                variants={fadeIn("right",0.3)} initial={"hidden"} whileInView={"show"} viewport={{once:false, amount:0.4 }} >
                    <Image src={event_image} alt='event' />
                </motion.div>
            </div>
        </div>
    )
}

export default CurrentEvents