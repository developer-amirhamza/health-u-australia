"use client"
import React, { useState } from 'react'
import PageBanner from 'app/utils/PageBanner'
import { gallery_images, sil_property } from 'config/page'
import Image from 'next/image'
import { FaPlus } from 'react-icons/fa'
import SlideModal from 'app/components/SlideModal'
import Title from 'app/utils/Title';
import { motion } from 'framer-motion'
import { fadeIn } from 'app/variants'

const Gallery = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0)
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Gallery' path='/gallery' />
            <div className="container px-5 py-10 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <motion.div
                initial={'hidden'}
                whileInView={"show"}
                variants={fadeIn("up",0.3)}
                viewport={{once:true,amount:0.3,}}
                className="">
                    <Title title1='SIL Gallery – ' title2='Health U Australia' className={`place-content-center place-items-center `} />
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-4  place-content-around  w-full ">
                    {gallery_images.map((img, index) => (
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
                {/* <div className="flex items-center justify-center w-full py-10">
                    <video
                        className='w-full max-w-md object-scale-down max-h-200 h-auto rounded-lg bg-black'
                        controls
                        preload="metadata"
                        playsInline
                        autoPlay
                    >
                        <source src="/videos/houseViewing.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div> */}
                {isOpen && <SlideModal close={() => setIsOpen(false)} currentId={currentId} />}
            </div>
        </div>
    )
}

export default Gallery