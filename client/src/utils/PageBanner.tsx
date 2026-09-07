import React from 'react'
import banner from "assets/images/banner-img.jpg"
import Link from 'next/link'

interface PageBannerProps {
    path:string,
    title:string
}
const PageBanner: React.FC <PageBannerProps> = ({path, title}) => {
  return (
    <div className="flex w-full h-full items-center justify-center min-h-[60vh] "
    style={{backgroundImage: `url(${banner.src})`, backgroundRepeat:"no-repeat", backgroundSize:"cover", backgroundPosition:"top center"  }}
    >
        <div className="container flex flex-col gap-1 items-center justify-center max-sm:px-5 ">
            <h1 className="text-6xl font-extrabold text-center text-secondary uppercase">{title} </h1>
            <ul className="flex justify-center items-center text-white text-3xl ">
                <li className="hover:text-secondary transition-colors duration-300">
                    <Link href={"/"}>Home</Link>
                </li>/
                <li className="hover:text-secondary transition-colors duration-300">
                    <Link href={path}>{title}</Link>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default PageBanner