"use client"
import React, { useEffect, useState } from 'react'
import PageBanner from 'utils/PageBanner'
import Image from 'next/image'
import { TiTick } from 'react-icons/ti';
import Link from 'next/link';
import Title from 'utils/Title';
import { motion } from 'framer-motion';
import { fadeIn } from 'app/variants';
import { SummeryApi } from 'app/common/SummeryApi';
import Axios from 'utils/Axios';
import AxiosToastError from 'utils/AxiosToastError';

interface CommunityParticipationItem {
    id: string;
    pageKey: string;
    section: string | null;
    title: string;
    slug: string | null;
    body: {
        title1?: string;
        title2?: string;
        paragraph1?: string;
        paragraph2?: string;
        paragraph3?: string;
        bullet_points?: string[];
    };
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

const CommunityContent = () => {

    const [community_participation, setCommunityParticipation] = useState<CommunityParticipationItem[]>([]);

    // Fetch Community Participation sections from the CMS.
    const fetchCommunityParticipation = async () => {
        try {
            const response = await Axios({
                ...SummeryApi.getContent,
                params: {
                    pageKey: "community_participation",
                },
            });

            if (response.data?.success) {
                const data: CommunityParticipationItem[] = response.data.data || [];

                // Only published content should appear on the public website.
                // Display order is controlled from the admin CMS.
                const publishedContent = data
                    .filter((item) => item.isPublished)
                    .sort((a, b) => a.order - b.order);

                setCommunityParticipation(publishedContent);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        fetchCommunityParticipation();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner title='Community Participation' path='/community-participation' />
            <div className="container px-5 flex flex-col gap-6 items-center mx-auto justify-center w-full h-full ">
                {community_participation.map((item, index) => (
                    <div key={item.id} className={`flex flex-col gap-x-8 ${[0, 2, 4].includes(index) ? 'md:flex-row-reverse' : 'md:flex-row'} justify-center items-start w-full`}>
                        <motion.div initial="hidden" whileInView={"show"} variants={fadeIn([0, 2, 4].includes(index) ? "right" : "left", 0.2)}
                            className="flex w-full h-full">
                            <Image
                                src={item.images[0]}
                                alt='about heath u australia'
                                width={500}
                                height={520}
                                className='hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center rounded-md  inset-0 items-start justify-start p-0 m-0 '
                            />
                        </motion.div>
                        <motion.div initial="hidden" whileInView={'show'} variants={fadeIn([0, 2, 4].includes(index) ? "left" : "right", 0.2)}
                            className="flex flex-col w-full justify-center gap-2   ">
                            <Title
                                title1={item.body.title1 || ""}
                                title2={item.body.title2 || ""}
                            />
                            <p className=" flex w-full text-lg text-secondary-text font-medium  ">{item.body.paragraph1}</p>
                            <ul className="grid gap-2">
                                {item?.body?.bullet_points && item?.body?.bullet_points.map((itm, idx) => (
                                    <li key={idx} className=" flex items-start w-full gap-2 ">
                                        <TiTick className='bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white ' />
                                        <p className="text-lg font-medium text-secondary-text ">{itm}</p>
                                    </li>
                                ))}
                                <p className="text-lg text-secondary-text font-medium my-2">{item.body.paragraph2} </p>
                                {item.body.paragraph3 && <p className="text-lg text-secondary-text font-medium my-2">{item.body.paragraph3}</p>}
                            </ul>
                        </motion.div>
                    </div>
                ))}

                <motion.div initial="hidden" whileInView={"show"} variants={fadeIn("down",0.2)} className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    ">
                    <h2 className="text-3xl font-bold  ">It’s Time to Bravely Participate in Your Community!</h2>
                    <div className='w-14 h-0.75 bg-primary items-center  ' />
                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        Bravely move forward to participate in your community, as we have got your back. <Link className='text-blue-600' href={"/contact"}> Get in touch</Link>  with our team to learn how they can make this possible.
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

export default CommunityContent