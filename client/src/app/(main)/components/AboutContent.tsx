"use client"

import PageBanner from 'utils/PageBanner'
import Image from 'next/image'
import React from 'react';

import about_icon from "assets/images/about/about-icon-img01.png"
import about_icon1 from "assets/images/about/about-icon-img02.png"
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { about } from 'config/page';
import Title from 'utils/Title';
import { motion } from 'framer-motion';
import { useManagedPage } from 'app/(main)/(pages)/_managed/useManagedPage';

const AboutContent = () => {
  const { data } = useManagedPage<{ sections: { title1: string; title2: string; paragraph1: string; image: string }[]; mission: { title1: string; title2: string; paragraph1: string }; values: { title1: string; title2: string; bullets: { keyword: string; text: string }[] }; cta: { title: string; text: string } }>('about');
  const sections = data?.sections ?? about.slice(0, 2).map(item => ({ ...item, image: '' }));
  const mission = data?.mission ?? about[2];
  const values = data?.values ?? { ...about[3], bullets: about[3].bullet_points ?? [] };
  const cta = data?.cta;
  return (
    <div className="flex flex-col justify-center items-center w-full h-full ">
      <PageBanner title='About Health U Australia' path='/about' />

      <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full ">
        <div className="grid w-full gap-12 py-10 md:gap-16">
          {sections.map((item, index) => (
            <div key={index} className={`flex w-full flex-col items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              <motion.div className="w-full min-w-0 shrink-0 md:w-[calc(50%-1rem)]"
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
                <Image src={item.image && !item.image.startsWith("/images/about/") ? item.image : about[index % 2].image} alt='about heath u australia'
                  className='hover:scale-102 ease-in-out transition-all duration-500 rounded-md w-full h-auto object-cover' />
              </motion.div>
              <motion.div className="flex min-w-0 w-full flex-col justify-center gap-2 md:w-[calc(50%-1rem)]"
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
                <p className="w-full text-lg text-secondary-text font-medium whitespace-pre-line break-words">{item.paragraph1}</p>
              </motion.div>
            </div>
          ))}
          {/* blogs end */}
        </div>



        <motion.div className="flex w-full items-stretch justify-center flex-col md:flex-row gap-10 my-16 "
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
          <div className=" border border-secondary-text/40 hover:scale-102 ease-in-out transition-all duration-500 flex-1 min-w-0 flex flex-col items-stretch p-8 w-full rounded-md shadow-2xl gap-10 ">
            <Image src={about_icon} alt='about health u australia' />
            <div className="flex flex-col w-full justify-center gap-4    ">
              <Title title1={mission.title1} title2={mission.title2} />
              <p className=" flex w-full text-lg text-secondary-text font-medium  ">{mission.paragraph1} </p>
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
            <div className="flex min-w-0 w-full flex-col justify-center gap-2">
              <Title title1={values.title1} title2={values.title2} />
              <ul className=" flex flex-col w-full text-lg text-secondary-text font-medium gap-3 ">
                {values.bullets?.map((item, index) => (
                  <li key={index} className=" flex items-start w-full gap-2 ">
                    <TiTick className='bg-secondary rounded-full text-2xl h-6 w-6 shrink-0 mt-0.5 text-white' />
                    <p className="min-w-0 flex-1 text-xl text-secondary-text font-bold break-words">{item.keyword}
                      <span className="text-lg font-medium ">{item.text} </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col w-full justify-center gap-4 items-center bg-gray-100 p-10    "
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
          <h2 className="text-3xl font-bold  ">{cta?.title ?? "Let Us Guide You To A New Tomorrow"}</h2>
          <div className='w-14 h-0.75 bg-primary items-center  ' />
          <p className=" flex w-full text-lg text-secondary-text font-medium text-center ">
            {cta?.text ?? "Talk to our support staff so that we know what precisely you want from us. You can also write to us stating your support needs and we will get back to you immediately."}
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