"use client"
import { sil_property, normanhurst_slides } from 'config/page'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import { MdClose } from 'react-icons/md'



interface Type {
    close: boolean | any,
    currentId: number,
}


const SlideModalForNormanhurst: React.FC<Type> = ({ close, currentId }) => {

    const prevRef = useRef<any>(null);
    const nextRef = useRef<any>(null);
    const swiperRef = useRef<any>(null);
    // const [mounted, setMounted] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(currentId ?? 0);

    // useEffect(() => {
    //     setMounted(true);
    // }, []);

    useEffect(() => {
        setActiveIndex(currentId ?? 0);
    }, [currentId]);

    const handlePrev = () => {
        const newIndex = (activeIndex - 1 + normanhurst_slides.length) % normanhurst_slides.length;
        setActiveIndex(newIndex);
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(newIndex);
        }
    };

    const handleNext = () => {
        const newIndex = (activeIndex + 1) % normanhurst_slides.length;
        setActiveIndex(newIndex);
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(newIndex);
        }
    };


    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/95 w-full h-full  flex items-center justify-center '>
            <div className="w-full max-h-130 h-full mt-20 max-w-4xl flex relative  flex-col">
                <Swiper
                    ref={swiperRef}
                    loop={true}
                    spaceBetween={30}
                    modules={[Navigation, Autoplay]}
                    navigation={false}
                    className='flex w-full h-full  relative justify-center mx-auto  items-center '

                    style={{
                        '--swiper-navigation-color': '#f59e0b',
                        '--swiper-pagination-color': '#f59e0b',
                    } as React.CSSProperties}
                >
                    <SwiperSlide key={activeIndex}>
                        <div className="flex flex-col  h-full w-full   items-center justify-self-center  rounded-2xl bg-white ">
                            <Image src={normanhurst_slides[activeIndex].image} alt={"slide"}
                                className=' flex w-full h-full  object-cover  rounded-lg ' />
                        </div>
                    </SwiperSlide>
                    <div className="flex justify-between items-center absolute top-2/4 z-100   w-full">
                        <button ref={prevRef} onClick={handlePrev} className=" text-amber-500 text-4xl px-1.5 py-1  rounded cursor-pointer hover:bg-amber-200 bg-amber-100 "><FaAngleLeft /> </button>
                        <button ref={nextRef} onClick={handleNext}
                            className=" text-amber-500 text-4xl px-1.5 py-1 rounded cursor-pointer hover:bg-amber-200 bg-amber-100 "><FaAngleRight /> </button>
                    </div>
                </Swiper>
                <button onClick={close} className="absolute top-10  border rounded-full p-1 cursor-pointer hover:text-primary transition-colors duration-300 hover:bg-secondary -right-20 text-white text-2xl">
                    <MdClose />
                </button>
            </div>

        </div>
    )
}

export default SlideModalForNormanhurst