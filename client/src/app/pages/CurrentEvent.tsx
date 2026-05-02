"use client"

import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import React, { useState } from 'react'
import { PiMapPinAreaFill } from 'react-icons/pi';
import event_image from "assets/images/events/cooking class.png";
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';
import { FaCalendarAlt, FaClock, FaPlus } from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { cooking_gallery } from 'config/page';
import Title from 'app/utils/Title';
import CookingSlideModal from 'app/components/CookingSlideModal';

const CurrentEvents = () => {
    const [isOpen, setIsOpen] = useState(false);
        const [currentId, setCurrentId] = useState(0)
    return (
        <div className="grid w-full h-full gap-10  ">
            <PageBanner title='Current Events' path='/current-events' />
            <div className="container mx-auto items-start w-full justify-center my-10 rounded border-neutral-300  gap-12 border text-secondary-text p-10 flex flex-col md:flex-row  ">
                {/* <div className="flex w-full  h-full items-center justify-center">
                    <Image src={event_image} alt='event' />
                </div> */}
                <motion.div className="flex flex-col gap-6 items-start py-5 text-lg w-full "
                    initial="hidden" whileInView={"show"} variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.2 }}>
                    <h1 className="text-4xl font-semibold ">Health U Australia - Cooking Class</h1>
                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">Class Time & Date</h1>
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center gap-2 text-secondary-text ">
                                <FaClock size={30} className='text-primary' />
                                <p className=" text-secondary-text font-medium text-xl "> 1:00 pm - 3:00 pm</p>
                            </div>
                            <div className="flex items-center gap-2 text-secondary-text ">
                                <FaCalendarAlt size={30} className='text-primary' />
                                <p className=" text-secondary-text font-medium text-xl "> Every Wednesday</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-3 pb-5">
                        <h1 className="text-2xl font-semibold ">Location:</h1>
                        <div className="flex items-center justify-between gap-10">
                            <div className="flex items-center gap-2 text-secondary-text ">
                                <FaMapLocationDot size={30} className='text-primary' />
                                <p className=" text-secondary-text font-medium text-xl ">SIL Bowden Street Ryde NSW 2112</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-10">
                        <p className=" text-secondary-text font-medium text-xl ">Healthy eating starts with confidence in the kitchen. 👩‍🍳</p>
                        <p className=" text-secondary-text font-medium text-xl ">Join our cooking class to learn simple, nutritious recipes that bring joy back to mealtimes. Cook, connect, and discover how good food can make you feel.</p>
                    </div>

                    {/* <div className="grid gap-3 py-5">
                        <h1 className="text-xl font-semibold ">Overview</h1>
                        <p className=" text-secondary-text font-medium  ">Step away from the desk and join a relaxed Parramatta River walk connecting professionals across the disability sector.</p>
                        <p className=" text-secondary-text font-medium  ">Join Get Picked Up, MyLife Housing and Health U Support Services for a relaxed networking walk along the Parramatta River, bringing together professionals across the disability and community services sector.</p>
                        <p className=" text-secondary-text font-medium  ">This event is about connection, conversation and wellbeing. Whether you prefer a faster pace or a slower walk-and-talk, the Bunny & Turtle Walk allows everyone to participate in a way that suits them.</p>
                        <p className=" text-secondary-text font-medium  ">Starting from Meadowbank, we’ll take a gentle walk along the river, creating space to step away from the desk, enjoy the outdoors, and connect with others across the disability and community services sector.</p>
                    </div>

                    <div className="grid gap-3 py-5">
                        <h1 className="text-2xl font-semibold ">Risk waiver:</h1>
                        <p className=" text-secondary-text font-medium  ">By participating in the Bunny & Turtle Walk, you acknowledge that this is a voluntary activity involving light physical movement. You are responsible for your own health, safety, and wellbeing during the event. Event hosts and partner organisations accept no liability for injury, loss, or damage incurred as a result of participation. Please seek medical advice if you have any concerns about taking part in physical activity.</p>
                    </div> */}
                </motion.div>
                <motion.div className="flex w-full  h-full items-start justify-center"
                    variants={fadeIn("right", 0.3)} initial={"hidden"} whileInView={"show"} viewport={{ once: false, amount: 0.2 }} >
                    <Image src={event_image} alt='event' />
                </motion.div>


            </div>
            {/* gallery */}

                <div className="container px-5 py-10 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <motion.div
                initial={'hidden'}
                whileInView={"show"}
                variants={fadeIn("up",0.3)}
                viewport={{once:true,amount:0.3,}}
                className="">
                    <Title title1='Cooking Gallery – ' title2='Health U Australia' className={`place-content-center place-items-center `} />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-4  place-content-around  w-full ">
                    {cooking_gallery.map((img, index) => (
                        <motion.div initial={{
                            opacity:0,
                            x:0,
                            y:-50,
                        }}
                        whileInView={{
                            opacity:1,
                            x:0,
                            y:0,
                            transition:{
                                type:"tween",
                                delay:index * 0.2,
                                duration:0.5,
                                ease:[0.25,0.25,0.25,0.75]
                            }
                        }}
                        viewport={{once:false,amount:0.2}} custom={index}
                         key={index} onClick={() => { setIsOpen(!isOpen); setCurrentId(index) }} className="relative h-full w-full group ">
                            <Image src={img} alt={`sil property` + index} className='object-cover  relative rounded-md max-h-72 min-h-56  w-full h-full' />
                            <div className="absolute bg-black/70 flex items-center transition-all duration-700 justify-center hover:opacity-100 opacity-0 top-0 rounded-md cursor-pointer h-full w-full border-8 border-transparent ">
                                <div className="bg-black h-12 w-12 group-hover:opacity-100 opacity-0 transition-all duration-700 flex items-center justify-center rounded-full ">
                                    <FaPlus className='bg-white p-0.5 rounded-full text-xl m-0 ' />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {isOpen && <CookingSlideModal close={() => setIsOpen(false)} currentId={currentId} />}
            </div>
        </div>
    )
}

export default CurrentEvents