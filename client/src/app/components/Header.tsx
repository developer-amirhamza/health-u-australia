"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from "assets/logo.png"
import Link from 'next/link';
import { nav_items } from 'config/page';
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5';
import Nav from 'app/utils/Nav';
import { FaFacebookF, FaInstagramSquare, FaLinkedinIn, FaSearch } from 'react-icons/fa';
import { FcCustomerSupport } from 'react-icons/fc';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen,setIsOpen] = useState(false);
  const [showTopBar, setShoTopBar]= useState(true);

  const handleToggle = (index:number)=>{
    setActiveIndex(index);
    setIsOpen(!isOpen);
  };

  useEffect(()=>{
    const handleScroll = ()=>{
      if(window.scrollY === 0){
        setShoTopBar(true);
      }else{setShoTopBar(false)}
    };

    window.addEventListener("scroll", handleScroll);
    return ()=>{
      window.removeEventListener("scroll",handleScroll);
    };
  },[]);

  return (
    <header className='w-full flex flex-col items-center justify-center sticky bg-white top-0 z-50 '>
       {/* top bar */}
      {showTopBar && <div className="flex w-full bg-secondary max-h-13 items-center justify-center h-full">
        <div className="container w-full  hidden   sm:flex items-center justify-between text-white  ">
          {/* contact list */}
          <div className="flex w-full items-center justify-start h-full gap-2">
            <FcCustomerSupport size={40} />
            <div className="grid w-full text-sm font-semibold">
            <a href="mailto:info@healthuau.com">info@healthuau.com</a>
            <div className="flex items-center gap-0.5  ">
              <a href="tel:+0481 707 758">0481 707 758 </a> /
              <a href="tel:+0481 707 758">0431 377 132</a>
            </div>
            </div>

          </div>
          {/* search bar */}
          <div className="flex items-center justify-center w-full relative">
            <input type="text" name="search" id="search"
            className='outline-none border border-white px-5 py-1.5 w-full flex rounded-full '
            />
            <div className=" absolute right-0 border-l px-2.5 py-2 ">
              <FaSearch size={22} />
            </div>
          </div>
          {/* social icons */}
          <ul className='flex flex-wrap w-full gap-10 items-center justify-end text-white py-1.5 ' >
          <li className=" border-2 p-1.5 rounded-full hover:bg-foreground hover:text-[#E1306C] transition-colors duration-300">
            <Link href={"https://www.instagram.com/healthu_au/"}><FaInstagramSquare size={18} /> </Link>
          </li>
          <li className=" border-2 p-1.5 rounded-full hover:bg-foreground hover:text-[#1877F2] transition-colors duration-300">
            <Link href={"https://www.facebook.com/healthuau/"}><FaFacebookF size={18} /> </Link>
          </li>
          <li className=" border-2 p-1.5 rounded-full hover:bg-foreground hover:text-[#0A66C2] transition-colors duration-300">
            <Link href={"https://www.linkedin.com/company/health-u-australia/"}><FaLinkedinIn size={18} /> </Link>
          </li>
        </ul>
        </div>
      </div>
      }
      {/* navbar */}
      <div className=" flex w-full items-center relative justify-between md:px-10 shadow-2xl  sm:px-5 px-2.5  ">
        <Link href="/" className="max-h-full ">
            <Image src={logo} alt='Health U logo' className='sm:h-20 sm:w-38 h-17 max-sm:pl-2 w-32 '  />
        </Link>
        {/* desktop menu */}
        <nav className='w-full flex mx-auto justify-end'>
          <ul className=" w-full items-center justify-end hidden  transition-all duration-500 lg:flex ">
            {nav_items.map((item, index)=>(
                <li key={index} className=' py-3 px-4 cursor-pointer last:hidden relative transition-all duration-500 text-center flex font-medium focus-within:text-primary  hover:text-primary text-base group  '>
                  <Nav path={item?.path} label={item?.label} />
                  {item?.options &&
                  <ul className="absolute bg-secondary top-12  text-neutral-900 flex-col w-full min-w-56 hidden transition-all duration-500  group-hover:flex ">
                    {item?.options.map((itm, idx)=>(
                      <li key={idx}
                      className='flex text-start hover:bg-primary hover:text-white py-3 px-5 font-medium transition-all duration-300  '>
                        <Link className='w-full flex font-medium' href={itm?.path}>{itm?.label}</Link>
                      </li>
                    ))}
                  </ul>
                  }
                </li>
              ))}
          </ul>
          <Link className='bg-primary sm:text-lg text-base uppercase text-white font-semibold
                rounded-full sm:px-5 px-4 py-2 sm:py-3 hover:bg-secondary transition-all duration-300' href={"/referral"}>Referral</Link>
          <button onClick={()=>setIsActive(!isActive)} className='text-secondary text-4xl z-100 px-4 cursor-pointer lg:hidden '>
            {isActive ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </nav>
        </div>
        {/* mobile  menu */}
        <nav className={`absolute h-full top-0 bottom-0 bg-neutral-800 lg:hidden pt-10 z-95 transition-all w-full ease-initial duration-700 min-w-94 min-h-screen flex flex-col gap-2
                ${isActive ? "left-0" : "-left-122" }
          `} >
        <h1 className="text-4xl font-bold text-center text-white">Menu </h1>
        <ul className=" w-full items-start justify-end border-t-3  text-white flex flex-col   ">
            {nav_items.map((item, index)=>(
                <li key={index} className=' flex flex-col w-full  cursor-pointer last:hidden relative   text-white text-base   '>
                  {item?.path ? <Link onClick={()=>setIsActive(!isActive)} className='py-3 px-10   hover:bg-secondary transition-all duration-500 hover:text-white  ' href={item?.path}>{item.label}</Link> :
                  <div onClick={()=>handleToggle(index)} className='flex min-w-full hover:bg-secondary transition-all duration-500 hover:text-white py-3 px-10 items-center justify-between'>
                    <h2 className="flex">{item.label}</h2>
                  {activeIndex === index && !isOpen ? <IoCaretUpSharp  /> : <IoCaretDownSharp  />}
                  </div> }
                  {activeIndex === index && !isOpen && item.options && <ul className=" flex-col w-full min-w-56  transition-all duration-500  flex ">
                    {item?.options.map((itm, idx)=>(
                      <li key={idx} className='flex text-center hover:bg-secondary hover:text-white py-2 px-5 ml-4 font-medium not-last:border-b border-black/20 transition-all duration-300  '>
                        <Link onClick={()=>setIsActive(!isActive)} className='w-full flex' href={itm?.path}>{itm?.label}</Link>
                      </li>
                    ))}
                  </ul>
                  }
                </li>
              ))}
          </ul>
        </nav>
    </header>
  )
}

export default Header