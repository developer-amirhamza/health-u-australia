"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import PageBanner from 'utils/PageBanner'
import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import { SummeryApi } from 'app/common/SummeryApi'
import Axios from 'utils/Axios'

interface ResourceItem {
    id: string;
    category: string;
    title: string;
    description: string;
    link: string;
}

const SECTIONS: { category: string; heading: string; intro?: string }[] = [
    { category: 'REQUIRED_TRAINING', heading: 'Required NDIS Training' },
    { category: 'COMMISSION_RESOURCE', heading: 'Important NDIS Commission Resources' },
    {
        category: 'KNOWLEDGE_RESPONSIBILITY',
        heading: 'NDIS Knowledge and Responsibilities',
        intro: 'Key knowledge areas every placement student is expected to understand before and during their placement.',
    },
]

const ResourceCard = ({ item }: { item: ResourceItem }) => (
    <Link
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm border hover:border-primary hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-secondary-text">{item.title}</h3>
            <FaArrowUpRightFromSquare className="text-primary shrink-0 mt-1" size={15} />
        </div>
        {item.description && <p className="text-base text-secondary-text/80">{item.description}</p>}
        <span className="text-primary font-medium text-sm mt-auto">View on NDIS Commission site</span>
    </Link>
)

const Training = () => {
    const [resources, setResources] = useState<ResourceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await Axios({ ...SummeryApi.getPublicTrainingResources });
                if (response.data?.success) setResources(response.data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <PageBanner title="Training" path="/training" />
            <div className="container max-md:px-5 flex flex-col items-center mx-auto justify-center w-full h-full gap-16 py-12">

                {/* Intro */}
                <div className="flex flex-col gap-4 max-w-4xl text-center">
                    <p className="text-lg text-secondary-text font-medium">
                        Health U Australia is committed to supporting students and workers to develop the knowledge and skills
                        required to provide safe, respectful and person-centred disability support. Please use the training
                        and resources below to familiarise yourself with key NDIS requirements.
                    </p>
                </div>

                {loading ? (
                    <div className="py-12 text-secondary-text">Loading training resources...</div>
                ) : (
                    SECTIONS.map((section, sIndex) => {
                        const items = resources.filter(r => r.category === section.category);
                        if (items.length === 0) return null;
                        return (
                            <div
                                key={section.category}
                                className={`flex flex-col gap-6 w-full ${sIndex === 1 ? "bg-gray-50 -mx-5 px-5 md:mx-0 md:px-8 py-12 rounded-2xl" : ""}`}
                            >
                                <div className="grid gap-2">
                                    <h2 className="text-3xl font-bold text-secondary">{section.heading}</h2>
                                    <div className="w-14 h-0.75 bg-primary" />
                                    {section.intro && <p className="text-lg text-secondary-text font-medium max-w-4xl">{section.intro}</p>}
                                </div>
                                <div className={`grid gap-5 ${sIndex === 0 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                                    {items.map((item) => (
                                        <ResourceCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* CTA */}
                <div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10 rounded-2xl">
                    <h2 className="text-3xl font-bold">Questions About Your Placement?</h2>
                    <div className="w-14 h-0.75 bg-primary items-center" />
                    <p className="flex text-lg text-secondary-text font-medium text-center">
                        Get in touch with our team if you need any help with the training or induction process.
                    </p>
                    <div className="flex items-center justify-center gap-10">
                        <Link href={"/contact-us"} className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300">Contact Us</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Training
