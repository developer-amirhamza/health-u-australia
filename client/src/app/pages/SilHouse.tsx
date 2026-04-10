"use client"
import React, { useState } from 'react'
import PageBanner from 'app/utils/PageBanner'
import Image from 'next/image'
import icon1 from "assets/images/2026/10/icon.png"
import icon2 from "assets/images/2026/10/icon2.png"
import icon3 from "assets/images/2026/10/icon4.png"
import { TiTick } from 'react-icons/ti';
import { sil_house, sil_house_details, sil_house_gallery } from 'config/page'
import Button from 'app/utils/Button'
import Title from 'app/utils/Title'
import { FaPlus } from 'react-icons/fa'
import SlideModal from 'app/components/SlideModal'
import { motion } from 'framer-motion'
import { fadeIn } from 'app/variants';


const SilHouse = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='SIL House' path='/sil-house' />
            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                {sil_house.map((item: any, index: number) => (
                    <div key={index} className={`flex flex-col my-10 gap-x-10 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center items-start w-full`}>
                        <motion.div className="flex w-full h-full"
                        initial={{
                            opacity:0,
                            x:[0,2,4].includes(index) ? 80 : -80,
                            y:0,
                        }}
                        whileInView={{
                            opacity:1,
                            x:0,
                            y:0,
                            transition:{
                                type:"tween",
                                delay:0.3,
                                duration:1,
                                ease:[0.25,0.25,0.25,0.75]
                            }
                        }}
                        >
                        <Image src={item.image} alt='about heath u australia' className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-contain inset-0 items-start justify-start p-0 m-0 ' />
                        </motion.div>
                        <motion.div className="flex flex-col w-full justify-center gap-2 "
                        initial={{
                            opacity:0,
                            x:[0,2,4].includes(index) ? -80 : 80,
                            y:0,
                        }}
                        whileInView={{
                            opacity:1,
                            x:0,
                            y:0,
                            transition:{
                                type:"tween",
                                delay:0.3,
                                duration:1,
                                ease:[0.25,0.25,0.25,0.75]
                            }
                        }}
                        >
                            <Title title1={item.title1} title2={item.title2} />
                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1}</p>
                            <ul className="grid gap-2">
                                {item?.bullet_points && <h4 className="text-xl my-3 text-secondary-text font-semibold">{item.bullet_title} </h4>}
                                {item?.bullet_points && item?.bullet_points.map((itm: any, idx: number) => (
                                    <li key={idx} className=" flex items-start w-full gap-2 ">
                                        <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                        <p className="text-lg font-medium text-secondary-text ">{itm}</p>
                                    </li>
                                ))}
                                <p className="text-lg text-secondary-text font-medium my-2">{item.paragraph2} </p>
                            </ul>
                        </motion.div>
                    </div>
                ))}
                {/* blogs section ends */}

                {/* blogs footer ends */}
                <motion.div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10"
                initial={"hidden"} whileInView={"show"} variants={fadeIn("up",0.5)}
                >
                    <h1 className="text-3xl font-bold  ">Get Started with Our Exceptional SIL Assistance!</h1>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" flex  text-lg text-secondary-text font-medium text-center ">
                        Get in touch with us now to opt for our exceptional SIL assistance and get started attaining independence and cheerfulness in life.
                    </p>
                    <div className="flex items-center justify-center gap-10">
                        <Button path={"/contact-us"} label='Enquire Now' />
                        <Button path={"/referral"} label='Referral' />
                    </div>
                </motion.div>
                {/* page footer ends */}


                <div className=" grid grid-cols-1 md:grid-cols-2 place-content-start py-10 ">
                    <motion.div className="grid place-content-start w-full gap-5"
                    initial={"hidden"} whileInView={"show"} variants={fadeIn("left" , 0.2)} >
                        <Title title1='Convenient Ryde Home SIL, MTA, Respite –' title2='AVAILABLE NOW' />
                        <p className="text-secondary-text text-medium text-lg">Ryde NSW 2112</p>
                        <div className="flex items-center justify-start py-5 gap-5">
                            <div className="flex flex-col p-4  gap-2 text-secondary-text rounded-sm items-center justify-between border  ">
                                <Image src={icon1} alt='icon1' />
                                <p className="text-secondary-text  font-semibold text-center">3</p>
                            </div>
                            <div className="flex flex-col p-4  gap-2 text-secondary-text rounded-sm items-center justify-between border  ">
                                <Image src={icon2} alt='icon1' />
                                <p className="text-secondary-text  font-semibold text-center">3</p>
                            </div>
                            <div className="flex flex-col p-4  gap-2 text-secondary-text rounded-sm items-center justify-between border  ">
                                <Image src={icon3} alt='icon1' />
                                <p className="text-secondary-text  font-semibold text-center">3</p>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div initial={"hidden"} whileInView={"show"} variants={fadeIn("right",0.2)} className="grid gap-5 place-content-start w-full">
                        <Title title1='' title2='AVAILABLE NOW' />
                        <p className="text-secondary-text text-medium text-lg">Beautiful shared home close to Top Ryde Shopping Center and hospital.</p>
                        <Button path='sil-sta-respite-initial-inquiry' label='sil enquiry' />
                    </motion.div>
                </div>

                <motion.div className="flex flex-col w-full justify-center gap-4 mt-8"
                initial="hidden" whileInView={"show"} variants={fadeIn("up",0.5)} viewport={{once:false, amount:0.3}} >
                    <Title title1={sil_house_details[0].title1} title2={sil_house_details[0].title2} />
                    <p className=" flex w-full text-lg text-secondary-text font-medium  ">{sil_house_details[0].paragraph1}</p>
                    <p className=" flex w-full text-lg text-secondary-text font-medium  ">{sil_house_details[0].paragraph2}</p>
                    <p className=" flex w-full text-lg text-secondary-text font-medium  ">{sil_house_details[0].paragraph3}</p>
                    <p className=" flex w-full text-lg text-secondary-text font-medium  ">{sil_house_details[0].paragraph4}</p>
                    <p className=" flex w-full text-lg text-secondary-text font-medium  ">{sil_house_details[0].paragraph5}</p>
                    <ul className="grid gap-2">
                        {sil_house_details[0].bullet_points && sil_house_details[0].bullet_points.map((itm: any, idx: number) => (
                            <li key={idx} className=" flex items-start w-full gap-2 ">
                                <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                <p className="text-lg font-medium text-secondary-text ">{itm}</p>
                            </li>
                        ))}
                        <p className="text-lg text-secondary-text font-medium my-2">{sil_house_details[0].paragraph6} </p>
                    </ul>
                </motion.div>

                <div className="flex w-full items-start flex-col justify-start overflow-x-auto  ">
                    <motion.div  className="flex w-full h-full" variants={fadeIn("right",0.5)} initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}} >
                        <Title title1='Property' title2='Features' />
                    </motion.div>
                    <table className='w-full rounded my-5 '>
                        <tbody className='w-full border-dotted border  divide-secondary-text'>
                            {sil_house_details[1].table_contents?.map((item: any, index: number) => (
                                <tr className='flex w-full px-3 py-2  border-dotted not-last:border-b gap-5' key={index}>
                                    <th className='flex-1 min-w-50 max-w-50 text-left'>{item.heading}</th>
                                    {item.options.map((itm: any, idx: number) => (
                                        <td className='flex-1 min-w-60 font-medium max-w-60 text-left' key={idx}>{itm}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid w-full my-10 gap-5">
                    <motion.div className="flex w-full h-full" variants={fadeIn("right",0.5)} initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}}>
                    <Title title1='Provider' title2='Details' />
                    </motion.div>
                    <motion.ul variants={fadeIn("down",0.4)} initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}}
                        className="flex text-lg flex-wrap w-full items-center justify-between">
                        <li className="font-semibold text-xl">The building </li>
                        <li className="">SIL Provider:</li>
                        <li className="">Health U Australia</li>
                    </motion.ul>
                </div>

                <motion.div variants={fadeIn("left",0.5)} initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}}
                className="grid w-full my-10 gap-5">
                    <Title title1='Application' title2='Criteria' />
                    <ul className="grid gap-2">
                        {sil_house_details[2].bullet_points?.map((itm: any, idx: number) => (
                            <li key={idx} className=" flex items-start w-full gap-2 ">
                                <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-1 text-white ' />
                                <p className="text-lg font-medium text-secondary-text "><strong>{itm?.keyword} </strong>{itm?.text}</p>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div className="grid w-full my-10 gap-5"
                variants={fadeIn("right",0.5)} initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}} >
                    <Title title1='What’s' title2='nearby' />
                    <ul className="grid gap-2">
                        {sil_house_details[3].options?.map((itm: any, idx: number) => (
                            <li key={idx} className=" flex  items-start w-full gap-2 ">
                                <h4 className=" min-w-40 font-bold uppercase">{itm.title}</h4>
                                <p className="text-secondary-text  font-medium">{itm.text}</p>
                            </li>
                        ))}
                    </ul>
                </motion.div>
                {/* sil house details contents */}

                <div className="grid w-full my-10 gap-10 place-content-center">
                    <motion.div initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}} variants={fadeIn("up",0.5)} className="flex w-full h-full">
                        <Title title1='Our' title2='Gallery' className={`place-items-center`} />
                    </motion.div>
                    <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8    place-content-around ">
                        {sil_house_gallery.map((item, index) => (
                            <motion.div  key={index} onClick={() => { setIsOpen(!isOpen); setCurrentId(index) }}
                            variants={fadeIn("up",index * 0.3)} initial={"hidden"} whileInView={"show"}
                            className="w-full h-full relative group">
                                <Image src={item} alt='Health_U_australia' className='object-cover relative w-full h-full max-h-72  ' />
                                <div className="absolute bg-black/70 flex items-center transition-all duration-700 justify-center hover:opacity-100 opacity-0 top-0 rounded-md cursor-pointer h-full w-full border-8 border-transparent ">
                                    <div className="bg-black h-12 w-12 group-hover:opacity-100 opacity-0 transition-all duration-700 flex items-center justify-center rounded-full ">
                                        <FaPlus className='bg-white p-0.5 rounded-full text-xl m-0 ' />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-full flex items-center justify-center my-12 border-5 border-secondary rounded   ">
                    <iframe
                        className="flex h-full w-full min-h-125 rounded"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18674.576669866256!2d151.11174077427498!3d-33.80809343537377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a5be90fc1aad%3A0x5017d681632c9f0!2sRyde%20NSW%202112%2C%20Australia!5e1!3m2!1sen!2sbd!4v1775793398565!5m2!1sen!2sbd"
                        width={400}
                        height={400}
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {isOpen && <SlideModal close={() => setIsOpen(false)} currentId={currentId} />}
            </div>
        </div>
    )
}

export default SilHouse