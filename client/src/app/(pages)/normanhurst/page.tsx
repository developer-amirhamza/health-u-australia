"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { belmore_slides, normanhurst_slides } from 'config/page'
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

import bed from "assets/images/sil-images/sil_icons/icon.png"
import bathroom from "assets/images/sil-images/sil_icons/icon2.png"
import car from "assets/images/sil-images/sil_icons/icon4.png"
import wheelchair from "assets/images/sil-houses/wheelchiar.png"
import map from "assets/images/sil-images/54A _belmore_street.png"
import Title from 'app/utils/Title'
import { fadeIn } from 'app/variants';
import SlideModal from 'app/components/SlideModal'
import SlideModalForNormanhurst from 'app/components/SlideModalForNormanhurst'

export const propertyData = {
  "title": "NDIS Accessible Housing in Normanhurst NSW 2076",
  "beds": 4,
  "baths": 2,
  "parking": 3,
  "tags": ["NDIS", "SIL", "Accessible", "Wheelchair Friendly"]
};
const page = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

const [isOpen, setIsOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    if (normanhurst_slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % normanhurst_slides.length);
    }, 5000);
    return () => { clearInterval(timer) }
  }, [])
  const handleNextBtn = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % normanhurst_slides?.length);
  }
  const handlePrevBtn = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + normanhurst_slides?.length) % normanhurst_slides?.length)
  }
  return (
    <div className="flex flex-col w-full h-full  ">
      <div className="min-h-[90vh] group relative">
        {normanhurst_slides?.map((slide: any, index: number) => {
          return (
            <div key={index}>
              <Image src={slide.image} className={`absolute  transition-opacity duration-1000 top-0 h-full  w-full  left-0  ${index === currentSlide ? "opacity-100" : "opacity-0"}
                object-cover`} alt="" />
              <motion.div
                initial={{
                  opacity: 0,
                  x: 80,
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
                    ease: [0.25, 0.25, 0.25, 0.75],
                  }
                }}
                viewport={{ once: false, amount: 0.5 }}
                className='top-1/3 absolute md:left-60 '
              >
                <div className={`bg-black/40 flex flex-col gap-2 p-8 transition-opacity duration-1000 text-white max-w-2xl ${index === currentSlide ? "opacity-100" : "opacity-0"}
                    z-30 h-48 rounded   mx-10 w-fit`} >
                  <h2 className="text-white uppercase text-xl font-light">{slide.heading} </h2>
                  {/* <p className=" uppercase text-2xl font-semibold">{slide.title} </p> */}
                  <p className="">{slide?.description} </p>
                  <div className="flex justify-between mt-5 ">
                    <Link href={"https://gonest.com.au/property/06082025-normanhurst-2076-fully-accessible-home-shaped-by-our-compassion-in-action-program-open-to-ndis-participants-with-or-without--normanhurst-2076"}
                      className='border hover:bg-secondary hover:border-secondary px-3.5 rounded-sm font-semibold py-2'
                    >Apply Now </Link>
                    <Link href={"https://gonest.com.au/property/06082025-normanhurst-2076-fully-accessible-home-shaped-by-our-compassion-in-action-program-open-to-ndis-participants-with-or-without--normanhurst-2076"}
                      className='border px-3.5 hover:bg-primary hover:border-primary rounded-sm font-semibold py-2'
                    >Book Inspection </Link>
                  </div>
                </div>
              </motion.div>
              <button className='bg-secondary/10 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-500 absolute  top-1/2 left-10 border p-4 z-60 rounded'
                onClick={handlePrevBtn}
              >
                <FaChevronLeft />
              </button>
              <button onClick={handleNextBtn}
                className='bg-secondary/10 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-500 absolute  top-1/2 right-10 border p-4 z-60 rounded'>
                <FaChevronRight />
              </button>

            </div>
          )
        })}
      </div>
      {/* Property Info */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-4">
          Compassion in Action – A Home That Supports Every Journey
        </h2>

        <p className="text-gray-600 mb-6">
          Located in Normanhurst NSW 2076, this fully accessible home is part of our Compassion in Action Program, designed to support NDIS participants at every stage of their journey.

          We proudly welcome participants with or without SIL funding, ensuring no one is left without a safe and stable place to live. Whether transitioning into independent living or seeking long-term support, this home offers comfort, flexibility, and care.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center ">
          <div className="flex  justify-center items-center gap-2 p-4 border rounded-lg">
            <Image src={bed} alt='icon' />
            <div className="">
              <p className="text-xl font-bold">{propertyData.beds}</p>
              <p>Bedrooms</p>
            </div>
          </div>

          <div className="flex  justify-center items-center gap-2 p-4 border rounded-lg">
            <Image src={bathroom} alt='icon' />
            <div className="">
              <p className="text-xl font-bold">{propertyData.baths}</p>
              <p>Bathrooms</p>
            </div>
          </div>

          <div className="flex  justify-center items-center gap-2 p-4 border rounded-lg">
            <Image src={car} alt='icon' />
            <div className="">
              <p className="text-xl font-bold">{propertyData.parking}</p>
              <p>Parking</p>
            </div>
          </div>

          <div className="flex  justify-center items-center gap-2 p-4 border rounded-lg">
            <Image src={wheelchair} alt='icon' />
            <div className="">
              <p className="text-xl font-bold">Fully</p>
              <p>Accessible</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid w-full my-4 gap-10 place-content-center container ">
                    <motion.div initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}} variants={fadeIn("up",0.5)} className="flex w-full h-full">
                        <Title title1='SIL House' title2='Gallery' className={`place-items-center`} />
                    </motion.div>
                    <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8    place-content-around ">
                        {normanhurst_slides.map((item, index) => (
                            <motion.div  key={index} onClick={() => { setIsOpen(!isOpen); setCurrentId(index) }}
                            variants={fadeIn("up",index * 0.3)} initial={"hidden"} whileInView={"show"}
                            className="w-full h-full relative group">
                                <Image src={item.image} alt='Health_U_australia' className='object-cover relative w-full h-full max-h-72  ' />
                                <div className="absolute bg-black/70 flex items-center transition-all duration-700 justify-center hover:opacity-100 opacity-0 top-0 rounded-md cursor-pointer h-full w-full border-8 border-transparent ">
                                    <div className="bg-black h-12 w-12 group-hover:opacity-100 opacity-0 transition-all duration-700 flex items-center justify-center rounded-full ">
                                        <FaPlus className='bg-white p-0.5 rounded-full text-xl m-0 ' />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

      {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Fully Accessible & Participant-Focused Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-start ">
            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-6">
                🏗️ Building & Access
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ Single-storey home</li>
                <li>✔ Ramp access</li>
                <li>✔ Wide doorframes & pathways</li>
                <li>✔ Wheelchair accessible</li>
                <li>✔ Air conditioning</li>
              </ul>
            </div>

            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-6">
                🌳 Outdoor Features
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ Secure backyard & front yard</li>
                <li>✔ Garden and green space</li>
                <li>✔ Deck / verandah</li>
                <li>✔ Outdoor entertainment area</li>
                <li>✔ Undercover access from parking</li>
              </ul>
            </div>

            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-6">
                🏡 Living Options
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ Shared living and kitchen</li>
                <li>✔ Shared laundry</li>
                <li>✔ Built-in wardrobes</li>
                <li>✔ Direct access to outdoor areas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

       {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Convenient Location in Normanhurst NSW
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-start ">
            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-4">
                🚆 Transport
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ 5-minute walk to Normanhurst Train Station</li>
                <li>✔ Bus stops nearby</li>
              </ul>
            </div>

            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-4">
                🏥 Healthcare
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ Hornsby Ku-ring-gai Hospital</li>
                <li>✔ Sydney Adventist Hospital</li>
              </ul>
            </div>

            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-4">
                🛍️ Shopping
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ 10 minutes to Hornsby Westfield</li>
              </ul>
            </div>

            <div className="">
              <h3 className="text-xl text-gray-800 font-bold mb-4">
                🌳 Lifestyle
              </h3>
              <ul className="grid gap-4 text-gray-700">
                <li>✔ Parks, cafes, and community facilities nearby</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-6xl container   items-start py-12">
        <h2 className="text-3xl font-bold mb-4">
          24/7 Support Tailored to Individual Needs
        </h2>

        <p className="text-gray-600 mb-4">
          Our experienced and compassionate team provides:
        </p>

        <ul className="grid md:grid-cols-2 gap-4 w-full list-disc text-gray-700">
          <li>24/7 onsite support</li>
          <li>Personalised care plans</li>
          <li>Daily living assistance</li>
          <li>Independence-building support</li>
        </ul>
         <p className="text-gray-600 mt-4">
          We work closely with participants, families, and coordinators to ensure a smooth and supportive experience.
        </p>
      </section>

      {/* GOOGLE MAP */}
                  <section className="py-16 px-6 bg-gray-50">
                    <div className="max-w-5xl mx-auto w-full">
                      <h2 className="text-3xl font-semibold text-center mb-6">
                        Location Map
                      </h2>
                      <div className="w-full h-full flex items-center justify-center my-12 border-5 border-secondary rounded   ">
                    <iframe
                        className="flex h-full w-full min-h-125 rounded"
                        src="https://www.google.com/maps/d/embed?mid=1Gb4VzkXbz9AqOeTyJ3KuuX9ogAg3ukk&ehbc=2E312F&noprof=1"
                        width={740}
                        height={480}
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
                    </div>
                  </section>

      {/* CTA */}
      <section className=" text-black bg-secondary text-center py-12">
        <h2 className="text-3xl font-bold mb-4">
          Secure a Safe & Supportive Home Today
        </h2>

        <p className="mb-6">
          Whether you’re a coordinator, participant, or family member — we’re ready to assist with fast and flexible placements.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={"/contact-us"} className="bg-white hover:bg-transparent border  text-black px-6 py-3 rounded-lg">
            Contact Us
          </Link>
          <Link href={"/referral"} className="border px-6 hover:bg-white py-3 rounded-lg">
            Refer Participant
          </Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Residence",
            name: "NDIS SIL & Respite Housing in Ryde NSW",
            description:
              "NDIS housing with SIL, STA, MTA and respite care in Ryde NSW. Urgent placement available.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Ryde",
              addressRegion: "NSW",
              postalCode: "2112",
              addressCountry: "AU",
            },
            numberOfRooms: 6,
            numberOfBathroomsTotal: 4,
            amenityFeature: [
              { "@type": "LocationFeatureSpecification", name: "Wheelchair Accessible" },
              { "@type": "LocationFeatureSpecification", name: "Air Conditioning" },
              { "@type": "LocationFeatureSpecification", name: "Secure Backyard" }
            ],
            provider: {
              "@type": "Organization",
              name: "Health U Australia"
            }
          }),
        }}
      />
      {isOpen && <SlideModalForNormanhurst close={() => setIsOpen(false)} currentId={currentId} />}
    </div>
  )
}

export default page