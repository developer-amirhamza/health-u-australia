import React from 'react'
import banner1 from "assets/images/banner-img.jpg"
import Image from "next/image"
import Link from "next/link"

const Hero = () => {
    return (
        <div className="flex w-full mx-auto items-center  justify-center relative sm:min-h-screen h-full "
        >
            <Image src={banner1} alt="Hero Image" layout="fill" objectFit="cover "  className="absolute   inset-0 z-0" />
            <div className="container mx-auto z-10  flex flex-col sm:flex-row ">
                <div className="w-full  flex flex-col flex-1 lg:justify-start justify-center rounded-lg  bg-secondary-light/20  p-10 gap-10 h-full">
                    <h2 className="text-4xl uppercase font-bold text-black ">Welcome to</h2>
                    <h1 className="text-black text-5xl font-bold uppercase">Health U <strong className="text-primary"> Support Services</strong></h1>
                    <p className="text-lg font-medium text-foreground ">
                        NDIS support providers committed to enhancing your health and well-being by assisting you according to your preferences and enabling you to live independently
                    </p>
                    <div className="flex items-center justify-start gap-5 ">
                        <button className="bg-primary text-white text-lg uppercase font-semibold px-8 py-5 rounded-full hover:bg-secondary transition-colors duration-300  ">
                            <Link href={""}>Contact Us </Link>
                        </button>
                        <button className="bg-secondary text-white text-lg uppercase font-semibold px-8 py-5 rounded-full hover:bg-primary transition-colors duration-300  ">
                            <Link href={""}>0481 707 758</Link>
                        </button>
                    </div>
                </div>
                <div className="flex-1 lg:flex hidden"></div>
            </div>
        </div>
    )
}

export default Hero