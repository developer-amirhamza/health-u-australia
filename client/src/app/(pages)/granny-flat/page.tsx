"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { granny_flat } from 'config/page'
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
import SlideModalForGranny from 'app/components/SlideModalForGranny'


export const propertyData = {
  title: "NDIS SIL & Respite Housing in Ryde NSW 2112",
  location: "Ryde NSW 2112",
  beds: 2,
  baths: 2,
  parking: 2,
  provider: "Health U Australia",
};
const page = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
const [isOpen, setIsOpen] = useState(false);
    const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    if (granny_flat.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % granny_flat.length);
    }, 5000);
    return () => { clearInterval(timer) }
  }, [])
   const handleNextBtn = ()=>{
    setCurrentSlide((prevSlide)=> (prevSlide +1) % granny_flat?.length);
  }
  const handlePrevBtn = ()=>{
    setCurrentSlide((prevSlide)=> (prevSlide - 1 + granny_flat?.length) % granny_flat?.length)
  }
  return (
    <div className="flex flex-col w-full h-full  ">
      <div className="min-h-[90vh] group relative">
        {granny_flat?.map((slide: any, index: number) => {
          console.log(slide.cta.primary)
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
                    z-30 h-60 rounded   mx-10 w-fit`} >
                  <h2 className="text-white uppercase text-xl font-light">{slide.heading} </h2>
                  {/* <p className=" uppercase text-2xl font-semibold">{slide.title} </p> */}
                  <p className="">{slide?.description} </p>
                  <div className="flex justify-between mt-5 ">
                    <Link href={"https://gonest.com.au/property/19032026-ryde-2112-sil-sta-mta-respite-hospital-transition-homes-flexible-ndis-housing-ryde-2112"}
                      className='border hover:bg-secondary hover:border-secondary px-3.5 rounded-sm font-semibold py-2'
                    >{slide.cta.primary} </Link>
                    <Link href={"https://gonest.com.au/property/19032026-ryde-2112-sil-sta-mta-respite-hospital-transition-homes-flexible-ndis-housing-ryde-2112"}
                      className='border px-3.5 hover:bg-primary hover:border-primary rounded-sm font-semibold py-2'
                    >{slide.cta.secondary} </Link>
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
          Flexible NDIS Housing in Ryde NSW
        </h2>

        <p className="text-gray-600 mb-6">
          Located in the heart of Ryde, this dual dwelling offers safe,
          accessible accommodation for NDIS participants requiring SIL, STA,
          MTA, or respite care. Ideal for hospital discharge and urgent
          placement.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-10">
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

      <div className="grid w-full my-4 gap-10 place-content-center container">
                          <motion.div initial={"hidden"} whileInView={"show"} viewport={{once:false,amount:0.2}} variants={fadeIn("up",0.5)} className="flex w-full h-full">
                              <Title title1='SIL House' title2='Gallery' className={`place-items-center`} />
                          </motion.div>
                          <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8    place-content-around ">
                              {granny_flat.map((item, index) => (
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
                      {isOpen && <SlideModalForGranny close={() => setIsOpen(false)} currentId={currentId} />}

      {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Property Features
          </h2>

          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li>✔ Single-storey with ramp access</li>
            <li>✔ Wide pathways for accessibility</li>
            <li>✔ Air conditioning & heating</li>
            <li>✔ Secure backyard & front yard</li>
            <li>✔ Outdoor entertainment area</li>
            <li>✔ Private & shared living spaces</li>
            <li>✔ Built-in wardrobes</li>
            <li>✔ Private & shared bathrooms</li>
          </ul>
        </div>
      </section>

      {/* Location */}
      <section className="max-w-6xl mx-auto px-6  items-start py-12">
        <h2 className="text-3xl font-bold mb-6">
          Prime Location in Ryde
        </h2>

        <p className="text-gray-600 mb-6">
          Close to hospitals, transport, and shopping centres for maximum
          convenience and support access.
        </p>

        <ul className="grid md:grid-cols-2 gap-4 w-full text-gray-700">
          <li>🏥 Ryde, Macquarie & Concord Hospitals</li>
          <li>🛍️ Top Ryde & Macquarie Centre</li>
          <li>🚍 Bus at your doorstep</li>
          <li>🌳 Parks & Parramatta River nearby</li>
        </ul>
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
                        src="https://www.google.com/maps/d/embed?mid=1pw_m1V9YtvaXSVaK5tZUn8EROw1x-oA&ehbc=2E312F&noprof=1"
                        width={640}
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
          Urgent Placement Available
        </h2>

        <p className="mb-6">
          Fast, flexible intake for NDIS participants. Contact us today to secure
          placement.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={"/contact-us"} className="bg-white hover:bg-transparent border  text-black px-6 py-3 rounded-lg">
            Apply Now
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
    </div>
  )
}

export default page