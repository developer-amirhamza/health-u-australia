"use client"
import React, { useEffect, useState } from 'react'
import { FaAngleDoubleUp } from 'react-icons/fa';

const ScrollToTopBtn = () => {
  const [showScrollbar, setShowScrollbar] = useState(false);
    useEffect(()=>{
        const handleScroll = ()=>{
            if(window.scrollY > 300){
              setShowScrollbar(true);
            }else{
              setShowScrollbar(false);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return ()=>{
          window.removeEventListener("scroll", handleScroll);
        }
    },[]);

    const scrollToTop = ()=>{
      window.scrollTo({
        top:0,
        behavior:"smooth"
      });
    };
  return (
    <>
        <button onClick={scrollToTop}
        className={` ${showScrollbar ? "translate-y-0 opacity-100 ":"-translate-y-[70vh] opacity-0 "}  fixed bottom-10 p-2 rounded text-white hover:text-amber-500
        cursor-pointer right-10 bg-primary transition-all duration-1000`}>
        <FaAngleDoubleUp size={20} />
      </button>
    </>
  )
}

export default ScrollToTopBtn