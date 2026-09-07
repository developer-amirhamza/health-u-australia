"use client"
import { motion } from 'framer-motion'
import PageBanner from 'utils/PageBanner'
import Image from 'next/image'
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { home_modification, sil_house } from 'config/page'
import Title from 'utils/Title'
import { fadeIn } from 'app/variants'

const HomeModification = () => {
    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Home Modification' path='/home-modification' />
            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className="grid w-full h-full gap-6">
                    {home_modification.map((item, index) => (
                        <div key={index} className={`flex flex-col gap-x-0 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center items-start w-full`}>
                            <motion.div variants={fadeIn([0, 2, 4].includes(index) ? "right" : "left", 0.2)} initial="hidden" whileInView={"show"}
                                className="flex w-full h-full">
                                <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center inset-0 items-start justify-start p-0 m-0 ' />
                            </motion.div>
                            <motion.div variants={fadeIn([0, 2, 4].includes(index) ? "left" : "right", 0.2)} initial="hidden" whileInView={"show"}
                                className="flex flex-col w-full justify-center gap-2   ">
                                <Title title1={item.title1} title2={item.title2} />
                                <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1}</p>
                                <ul className="grid gap-2">
                                    {item?.bullet_points && item?.bullet_points.map((itm: any, idx: number) => (
                                        <li key={idx} className=" flex items-start w-full gap-2 ">
                                            <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                            <p className="text-lg font-medium text-secondary-text ">{itm.text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    ))}
                </div>
                <motion.div variants={fadeIn("up", 0.2)} initial="hidden" whileInView={"show"}
                    className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <div className="flex items-center justify-center gap-10">
                        <Link href={"/contact-us"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Enquire Now</Link>
                        <Link href={"/referral"} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 ' >Referral</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default HomeModification