"use client"

import React from 'react'
import PageBanner from 'utils/PageBanner'
import Image from 'next/image'
import { motion } from 'framer-motion';
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import { useManagedPage } from '../_managed/useManagedPage';
import PageLoader from '../_managed/PageLoader';
import Title from 'utils/Title';
import { fadeIn } from 'app/variants';


const NDIS = () => {
    const { data, error, reload } = useManagedPage<{ banner: string; sections: { image: string; title1: string; title2: string; paragraph1: string; bulletTitle: string; bullets: { keyword: string; text: string }[] }[]; cta: { title: string; text: string; links: { label: string; href: string }[] } }>('ndis')
    if (error) return <div role="alert" className="container mx-auto p-8">Unable to load NDIS services. <button className="underline" onClick={reload}>Try again</button></div>
    if (!data) return <PageLoader label="Loading NDIS services" />
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <PageBanner title={data.banner} path='/ndis' />
            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full">
                <div className=" flex flex-col gap-12">
                    {data.sections.map((item, index) => (
                        <div key={index} className={` flex flex-col  gap-x-8 ${[0, 2, 4].includes(index) ? "md:flex-row" : "md:flex-row-reverse"}  justify-center items-start  w-full`} >
                            <motion.div className="flex w-full h-full"
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
                                }}
                            >
                                {item.image ? <Image src={item.image} alt={item.title1 + item.title2} width={700} height={520} className='hover:scale-102 ease-in-out transition-all duration-500 rounded-md  w-full h-full md:object-center inset-0 items-start justify-start p-0 my-5 ' /> : <div className="my-5 flex min-h-64 w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">Upload a photo to show it here</div>}
                            </motion.div>
                            <motion.div className="flex flex-col w-full justify-center gap-2"
                                initial={{
                                    opacity: 0,
                                    x: [0, 2, 4].includes(index) ? 80 : -80,
                                    y: 0,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    transition: {
                                        type: "tween",
                                        delay: 0.5,
                                        duration: 1,
                                        ease: [0.25, 0.25, 0.25, 0.75]
                                    },
                                }}>
                                <Title title1={item.title1} title2={item.title2} />
                                <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.paragraph1} </p>
                                <ul className="grid gap-2">
                                    {item.bulletTitle && <h4 className="text-xl my-3 text-secondary-text font-semibold">{item.bulletTitle} </h4>}
                                    {item.bullets?.map((itm, idx) => (
                                        <li key={idx} className=" flex items-start w-full gap-2 ">
                                            <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-6 max-w-6 mt-0.5 text-white ' />
                                            <p className=" text-xl text-secondary-text font-bold  ">{itm?.keyword}
                                                <span className="text-lg font-medium ">{itm?.text} </span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <motion.div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    "
                    variants={fadeIn("down", 0.3)}
                    initial={"hidden"}
                    whileInView={"show"}
                >
                    <h2 className="text-3xl font-bold  ">{data.cta.title}</h2>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" flex  text-lg text-secondary-text font-medium text-center ">
                        {data.cta.text}
                    </p>
                    <div className="flex items-center justify-center gap-10">
                        {data.cta.links.map(link => <Link key={link.href} href={link.href} className='text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 '>{link.label}</Link>)}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default NDIS
