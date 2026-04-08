import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
const ScrollToTop = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:"smooth",
        })
    },[usePathname]);
    return null;
}

export default ScrollToTop