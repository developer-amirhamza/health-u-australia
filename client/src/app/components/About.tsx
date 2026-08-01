"use client"
import React from 'react'
import about_img from "assets/images/about-img.jpg"
import Image from 'next/image'
import Link from 'next/link'
import {motion} from "framer-motion"
const About = () => {
    return (
        <section className='flex w-full  h-full ' >
            <div className="container mx-auto flex flex-col py-20 px-10 sm:flex-row gap-20">
                <motion.div
                initial={{
                    opacity:0,
                    x:-80,
                    y:0,
                }}
                whileInView={{
                    opacity:1,
                    x:0,
                    y:0,
                    transition:{
                        type:"tween",
                        duration:1,
                        delay:0.5,
                        ease:[0.25,0.25,0.25,0.25]
                    }
                 }}
                className="flex flex-1 w-full h-full ">
                    <Image src={about_img} alt='about health u australia '
                        className=' inset-0 w-auto  h-full object-cover rounded-tr-[150px] rounded-2xl  ' />
                </motion.div>
                <motion.div
                initial={{
                    opacity:0,
                    x:80,
                    y:0,
                }}
                 whileInView={{
                    opacity:1,
                    x:0,
                    y:0,
                    transition:{
                        type:"tween",
                        duration:1,
                        delay:0.5,
                        ease:[0.25,0.25,0.25,0.25]
                    }
                 }}
                className="flex-1 flex flex-col gap-8">
                    <h2 className="text-primary font-bold text-3xl">About Us</h2>
                    <h2 className="text-black font-extrabold text-[2.3rem] uppercase">We Offer Care <span className='text-secondary'>that Matters</span> </h2>
                    <p className="text-secondary-text text-lg font-medium ">
                        To reach your goals and achieve independence as a participant, you will need Health U Support Services since we are here to assist you by taking individual-specific approaches.
                        From the development of a support plan to implementing it, we will follow the steps required to make your life convenient.
                        <br /> <br />
                        Through our support services, we promote healthy living and social inclusiveness. Most importantly, we will help you make the most of your funding.
                        In fact, to offer the care that you need, we will coordinate with you and your family. So, if you are looking for professional NDIS support,
                        we have you covered.
                    </p>
                    <Link href={"/"} className='text-white bg-primary text-xl uppercase font-semibold rounded-full py-5 px-8
                        hover:bg-secondary transition-colors duration-300 items-start w-max '
                    >Learn more </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default About