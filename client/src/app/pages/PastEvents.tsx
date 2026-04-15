"use client"

import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import React from 'react'
import { PiMapPinAreaFill } from 'react-icons/pi';
import event_image from "assets/images/events/Bunny and Turtle Walk-5-3-26.png";
import { TiTick } from 'react-icons/ti';
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { SlCalender } from 'react-icons/sl';
import { FaMapLocationDot } from 'react-icons/fa6';

const PastEvents = () => {
    return (
        <div className="grid w-full h-full gap-10 ">
            <PageBanner title='Past Events' path='/past-events' />
            <div className="container mx-auto items-start w-full justify-center my-10 rounded border-neutral-300  gap-12 border text-secondary-text p-10 flex flex-col md:flex-row ">
                <motion.div  className="flex flex-col items-start text-lg w-full "
                initial="hidden" whileInView={"show"} variants={fadeIn('left',0.3)} viewport={{once:false,amount:0.2}}>
                    <h1 className="text-4xl font-semibold ">Bunny and Turtle Walk - NDIS Networking</h1>
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">Event Time & Date</h1>
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center gap-2 text-secondary-text ">
                            <FaClock size={30} className='text-primary' />
                            <p className=" text-secondary-text font-semibold text-sm "> 10:30 AM - 12 PM</p>
                        </div>
                        <div className="flex items-center gap-2 text-secondary-text ">
                            <FaCalendarAlt size={30} className='text-primary' />
                            <p className=" text-secondary-text font-semibold text-sm "> Wednesday, March 25</p>
                        </div>
                    </div>
                    </div>
                    <div className="grid gap-3 pb-5">
                        <h1 className="text-2xl font-semibold ">Start location:</h1>
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center gap-2 text-secondary-text ">
                            <FaMapLocationDot size={30} className='text-primary' />
                            <p className=" text-secondary-text font-semibold text-sm ">120–122 Bowden Street, Meadowbank</p>
                        </div>
                    </div>
                    </div>
                    <div className="grid gap-6">
                        <p className=" text-secondary-text font-semibold text-sm ">🚶‍♀️Walking along the Parramatta River</p>
                        <p className=" text-secondary-text font-semibold text-sm ">A cold beverage will be provided on the day.</p>
                    </div>

                    <div className="grid gap-3 py-5">
                        <h1 className="text-xl font-semibold ">Overview</h1>
                        <p className=" text-secondary-text font-medium  ">Step away from the desk and join a relaxed Parramatta River walk connecting professionals across the disability sector.</p>
                        <p className=" text-secondary-text font-medium  ">Join Get Picked Up, MyLife Housing and Health U Support Services for a relaxed networking walk along the Parramatta River, bringing together professionals across the disability and community services sector.</p>
                        <p className=" text-secondary-text font-medium  ">This event is about connection, conversation and wellbeing. Whether you prefer a faster pace or a slower walk-and-talk, the Bunny & Turtle Walk allows everyone to participate in a way that suits them.</p>
                        <p className=" text-secondary-text font-medium  ">Starting from Meadowbank, we’ll take a gentle walk along the river, creating space to step away from the desk, enjoy the outdoors, and connect with others across the disability and community services sector.</p>
                    </div>

                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">Risk waiver:</h1>
                        <p className=" text-secondary-text font-medium  ">By participating in the Bunny & Turtle Walk, you acknowledge that this is a voluntary activity involving light physical movement. You are responsible for your own health, safety, and wellbeing during the event. Event hosts and partner organisations accept no liability for injury, loss, or damage incurred as a result of participation. Please seek medical advice if you have any concerns about taking part in physical activity.</p>
                    </div>
                </motion.div>
                <motion.div className="flex w-full  " initial="hidden" whileInView={"show"} variants={fadeIn('right',0.3)} viewport={{once:false,amount:0.2}}>
                    <Image src={event_image} alt='event' />
                </motion.div>
            </div>
        </div>
    )
}

export default PastEvents