'use client'

import { service_items } from 'config/page'
import Image from 'next/image'
import React, { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import {motion} from "framer-motion";
import service_bg from "assets/images/services-pattan-img01.png"
import Link from 'next/link';

const Service = () => {

  const prevRef = useRef<any>(null);
  const nextRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className='w-full h-full relative' style={{ backgroundImage: `url(${service_bg.src})`, backgroundSize: 'cover', backgroundPosition: 'center',  }}>
      <div className="absolute inset-0 bg-yellow-500/30"></div>
      <div className="container mx-auto w-full h-full items-center justify-center py-12 flex flex-col relative z-10">
        <motion.div className="grid gap-8 py-7"
        initial={{
          opacity:0,
          x:0,
          y:-60,
        }}
        whileInView={{
          opacity:1,
          x:0,
          y:0,
          transition:{
            delay:0.5,
            duration:1,
            type:"tween",
            ease:[0.25,0.25,0.25,0.75]
          }
        }}
        >
        <h1 className=" text-4xl w-full text-center  text-primary font-bold ">Our Services</h1>
        <h1 className="text-4xl w-full  text-center text-black font-bold uppercase ">Comprehensive Disability Care Services</h1>
        </motion.div>
        <motion.div className="flex w-full h-full min-h-110 relative justify-center mx-auto  items-center"
        initial={{
          opacity:0,
          x:0,
          y:60,
        }}
        whileInView={{
          opacity:1,
          x:0,
          y:0,
          transition:{
            delay:0.5,
            duration:1,
            type:"tween",
            ease:[0.25,0.25,0.25,0.75]
          }
        }}

        >
           <Swiper
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          navigation={mounted ? {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          } : false}
          className='flex w-full h-full min-h-110 relative justify-center mx-auto  items-center '

          style={{
            '--swiper-navigation-color': '#f59e0b',
            '--swiper-pagination-color': '#f59e0b',
          } as React.CSSProperties}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}>
          {service_items.map((item, index) => (
            <SwiperSlide>
              <div key={index} className="flex flex-col  min-h-98 w-full max-w-70  items-center justify-self-center  rounded-2xl relative
             bg-white ">
                <Image src={item.image} alt={item.title}
                  className=' flex w-full h-full max-h-64 object-scale-cover absolute top-0 rounded-t-3xl rounded-b-full ' />
                <h1 className="absolute top-70 p-3 w-full flex text-center justify-center text-xl font-bold items-center">{item.title}</h1>
                <Link href={item.path} className=" py-3 px-5 hover:bg-secondary z-50 cursor-pointer transition-colors duration-300 rounded-full
              absolute -bottom-6 font-bold text-base uppercase bg-primary text-white  items-center justify-self-center  flex ">
                  View Details
                </Link >
              </div>
            </SwiperSlide>
          ))}
          <div className="flex justify-between items-center absolute top-2/5 z-100   w-full">
            <button ref={prevRef} className=" text-amber-500 text-4xl px-1.5 py-1 mr-5 rounded cursor-pointer hover:bg-amber-200 bg-amber-100 "><FaAngleLeft /> </button>
            <button ref={nextRef} className=" text-amber-500 text-4xl px-1.5 py-1 rounded cursor-pointer hover:bg-amber-200 bg-amber-100 "><FaAngleRight /> </button>
          </div>
        </Swiper>
        </motion.div>


      </div>
    </section>
  )
}

export default Service