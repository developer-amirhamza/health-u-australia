"use client"
import React from 'react'
import banner1 from "assets/images/banner-img.jpg"
import Image from "next/image"
import Link from "next/link"
import { useHomeContent } from './HomeContentContext'

const Hero = () => {
    const content = useHomeContent()?.hero
    const phone = content?.phone || '0481 707 758'
    return (
        <div className="relative mx-auto flex w-full items-center justify-center sm:min-h-screen">
            <Image src={content?.image || banner1} alt="Hero Image" fill sizes="100vw" className="absolute inset-0 z-0 object-cover" />
            <div className="container mx-auto z-10  flex flex-col sm:flex-row ">
                <div className="flex w-full flex-1 flex-col justify-center gap-10 rounded-lg bg-secondary-light/20 p-10 lg:justify-start">
                    <h2 className="text-4xl uppercase font-bold text-black ">{content?.welcome || 'Welcome to'}</h2>
                    <h1 className="text-black text-5xl font-bold uppercase">{content?.title || 'Health U'} <strong className="text-primary"> {content?.highlight || 'Support Services'}</strong></h1>
                    <p className="text-lg font-medium text-foreground ">
                        {content?.description || 'NDIS support providers committed to enhancing your health and well-being by assisting you according to your preferences and enabling you to live independently'}
                    </p>
                    <div className="flex items-center justify-start gap-5 ">
                        <Link className="bg-primary text-white text-lg uppercase font-semibold sm:px-8 sm:py-5 px-3 py-2 rounded-full hover:bg-secondary transition-colors duration-300" href={content?.contactHref || '/contact-us/'}>{content?.contactLabel || 'Contact Us'}</Link>
                        <a className="bg-secondary text-white text-lg uppercase font-semibold sm:px-8 sm:py-5 px-3 py-2 rounded-full hover:bg-primary transition-colors duration-300" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
                    </div>
                </div>
                <div className="flex-1 lg:flex hidden"></div>
            </div>
        </div>
    )
}

export default Hero
