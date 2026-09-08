'use client'

import { google_reviews } from 'config/page'
import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';
import StarRating from 'app/common/start-rating';
import google_icon from "assets/Google icon.png"
import google_map from "assets/images/staticmap.png"
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';
const Testimonials = () => {

    const prevRef = useRef<any>(null);
    const nextRef = useRef<any>(null);
    const [mounted, setMounted] = useState(false);
    const [rating, setRating] = useState(5);
    const [active, setActive] = useState(false)
    const [currentId,setCurrentId] = useState<number>()

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRatingChange = (getRating:number)=>{
        setRating(getRating)
    }

    return (
        <section className='w-full h-full     flex  '>
            <div className="container mx-auto w-full h-full sm-max:px-5  items-center justify-center py-12 flex flex-col  ">
                <motion.p className=" text-3xl w-full text-center p-5 text-primary font-bold "
                variants={fadeIn("left",0.5)}
                            initial="hidden"
                            whileInView={"show"} >Health U Australia</motion.p>
                <motion.h2 className="text-4xl w-full p-5 text-center text-black font-bold uppercase "
                variants={fadeIn("right",0.5)}
                            initial="hidden"
                            whileInView={"show"}>Our Testimonial</motion.h2>
                <div className="flex flex-col md:flex-row w-full h-full">
                    <div className="flex  items-start justify-start w-full h-full max-w-2/12 gap-2 my-6 ">
                        <Image src={google_map} alt='Health U Australia' className='object-cover h-full w-full max-h-16 max-w-16'/>
                        <div className="grid gap-3">
                            <h3 className="text-base font-semibold ">Health U Australia</h3>
                            <div className="">
                                <StarRating rating={rating}handleRatingChange={handleRatingChange} />
                                <p className="text-secondary-text font-medium">{google_reviews.length} Google reviews</p>
                            </div>
                            <Link href={"/"} className='border py-2 rounded-sm px-4 hover:bg-secondary-text transition-colors duration-300 font-bold hover:text-white'
                            >Write Review</Link>
                        </div>
                    </div>

                <Swiper
                    loop={true}
                    autoplay={{
                        delay:3000,
                        disableOnInteraction:false,
                    }}
                    modules={[Navigation, Autoplay]}
                    navigation={mounted ? {
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    } : false}
                    className='flex w-full h-full min-h-110 relative justify-center   items-center '
                    style={{
                        '--swiper-navigation-color': '#f59e0b',
                        '--swiper-pagination-color': '#f59e0b',
                    } as React.CSSProperties}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 0,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20,
                        },
                    }}>
                    {google_reviews.map((item:any, index:number) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col   w-full p-5 gap-5  items-start justify-start  rounded-2xl relative shadow-2xl
                                            bg-white ">
                                <div className="flex w-full items-start justify-between gap-1  ">
                                    {item?.image ? <Image src={item?.image} alt={item.name}
                                        className=' flex w-full h-full max-h-14 max-w-14 object-cover ' />
                                        : <h2 className="uppercase text-4xl text-white font-bold border border-secondary text-center flex items-center justify-center h-14 bg-green-600 w-14 rounded-full ">{item.name[0]} </h2>
                                    }

                                    <div className="">
                                        <p className=" w-full flex  justify-center text-base font-bold ">{item.name}</p>
                                        <p className="text-sm text-secondary-text font-medium  ">{item.date} ago</p>
                                    </div>
                                    <Image src={google_icon} className='flex object-scale-down w-5.5 h-5.5' alt='google'/>
                                </div>
                                <StarRating rating={rating} handleRatingChange={handleRatingChange} />
                                <div className="flex flex-col  gap-2">
                                    <p className={`text-sm font-medium  ${active && currentId == index ? "":"line-clamp-4"} `} >{item.paragraph}</p>
                                    <div onClick={()=>{setCurrentId(index); setActive(!active) }} className='text-secondary-text hover:underline cursor-pointer ' >{active && currentId == index ? "Read Less":"Read More"} </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    <div className="flex justify-between items-center absolute top-2/6 z-100   w-full">
                                <button ref={prevRef} className=" text-secondary-text text-2xl p-2 rounded-full cursor-pointer hover:bg-neutral-500 hover:text-white transition-colors dur bg-neutral-100 border "><MdArrowBackIosNew /> </button>
                                <button ref={nextRef} className=" text-secondary-text text-2xl p-2 rounded-full cursor-pointer hover:bg-neutral-500 hover:text-white transition-colors dur bg-neutral-100 border "> <MdArrowForwardIos /> </button>
                    </div>
                </Swiper>
                </div>
            </div>
        </section>
    )
}

export default Testimonials