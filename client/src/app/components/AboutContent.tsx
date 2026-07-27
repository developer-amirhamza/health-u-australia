"use client"

import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import React from 'react';

import about_icon from "assets/images/about/about-icon-img01.png"
import about_icon1 from "assets/images/about/about-icon-img02.png"
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { about } from 'config/page';
import Title from 'app/utils/Title';
import { motion } from 'framer-motion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:"NDIS Service Providers: Empowering Your Independence",
  description:"Explore our range of NDIS service providers dedicated to empowering participants for a life of choice and autonomy.",
};
const AboutContent = () => {
  const { image, title1, title2, paragraph1 } = about[2];
  const support = about[3];
  return (
    <div className="flex flex-col justify-center items-center w-full h-full ">
      <PageBanner title='About Health U Australia' path='/about' />

      <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
        <div className="grid gap-10 ">
          {about.slice(0, 2).map((item, index) => (
            <div key={index} className={`flex flex-col gap-x-8 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-between items-start w-full`}>
              <motion.div className="w-full h-full flex"
                initial={{
                  opacity: 0,
                  x: [0, 2, 4].includes(index) ? 80 : -80,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "tween",
                    duration: 1,
                    delay: 0.5,
                    ease: [0.25, 0.25, 0.25, 0.75]
                  }
                }}
              >
                <Image src={item.image} alt='about heath u australia'
                className='hover:scale-102 ease-in-out transition-all duration-500 rounded-md w-full h-full object-center inset-0 items-start justify-start p-0 m-0 ' />
              </motion.div>
              <motion.div className="flex flex-col w-full justify-center gap-2    "
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
                }}>
                <Title title1={item.title1} title2={item.title2} />
                <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1}</p>
              </motion.div>
            </div>
          ))}
          {/* blogs end */}
        </div>



        <motion.div className="flex w-full items-start justify-center flex-col md:flex-row gap-10 h-full  my-20 "
          initial={{
            opacity: 0,
            y: -80,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "tween",
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.25, 0.25, 0.75]
            }
          }}
        >
          <div className=" border border-secondary-text/40 hover:scale-102 ease-in-out transition-all duration-500 flex-1 flex flex-col items-start p-8 w-full h-full rounded-md shadow-2xl gap-10 ">
            <Image src={about_icon} alt='about health u australia' />
            <div className="flex flex-col w-full justify-center gap-4    ">
              <Title title1={title1} title2={title2} />
              <p className=" flex w-full text-lg text-secondary-text font-medium  ">{paragraph1} </p>
            </div>
          </div>


          <motion.div className=" border border-secondary-text/40 hover:scale-102 ease-in-out transition-all duration-500 flex-1 flex flex-col items-start p-8 w-full rounded-md shadow-2xl gap-10 "
            initial={{
              opacity: 0,
              y: -80,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                type: "tween",
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.25, 0.25, 0.75]
              }
            }}>
            <Image src={about_icon1} alt='about health u australia' />
            <div className="flex flex-col w-full justify-center gap-2    ">
              <Title title1={support.title1} title2={support.title2} />
              <ul className=" flex flex-col w-full text-lg text-secondary-text font-medium gap-3 ">
                {support.bullet_points?.map((item, index) => (
                  <li key={index} className=" flex items-start w-full gap-2 ">
                    <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-6 max-w-6 mt-0.5 text-white ' />
                    <p className=" text-xl text-secondary-text font-bold  ">{item.keyword}
                      <span className="text-lg font-medium ">{item.text} </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    "
          initial={{
            opacity: 0,
            y: -80,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "tween",
              duration: 1,
              delay: 0.5,
              ease: [0.25, 0.25, 0.25, 0.75]
            }
          }}>
          <h1 className="text-3xl font-bold  ">Let Us Guide You To A New Tomorrow</h1>
          <div className='w-14 h-0.75 bg-primary items-center  ' />
          <p className=" flex w-full text-lg text-secondary-text font-medium text-center ">
            Talk to our support staff so that we know what precisely you want from us. You can also write to us stating your support needs and we will get back to you immediately.
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

export default AboutContent