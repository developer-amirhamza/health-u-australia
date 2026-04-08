"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import logo from "assets/logo.png"
import Link from 'next/link';
import { nav_items } from 'config/page';
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5';
import Nav from 'app/utils/Nav';

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen,setIsOpen] = useState(false)

  const handleToggle = (index:number)=>{
    setActiveIndex(index);
    setIsOpen(!isOpen);
  }


  return (
    <header className='w-full flex items-center justify-center sticky bg-white top-0 z-50 '>
      <div className=" flex w-full items-center relative justify-between md:px-10  sm:px-5 px-2.5  ">
        <Link href="/" className="max-h-full ">
            <Image src={logo} alt='Health U logo' className='h-24 w-44'  />
        </Link>
        {/* desktop menu */}
        <nav className='w-full flex justify-end'>
          <ul className=" w-full items-center justify-end hidden  transition-all duration-500 lg:flex ">
            {nav_items.map((item, index)=>(
                <li key={index} className=' py-3 px-4 cursor-pointer last:hidden relative transition-all duration-500 text-center flex font-medium focus-within:text-primary  hover:text-primary text-base group  '>
                  <Nav path={item?.path} label={item?.label} />
                  {item?.options &&
                  <ul className="absolute bg-secondary top-12  text-neutral-900 flex-col w-full min-w-56 hidden transition-all duration-500  group-hover:flex ">
                    {item?.options.map((itm, idx)=>(
                      <li key={idx}
                      className='flex text-start hover:bg-primary hover:text-white py-3 px-5 font-medium transition-all duration-300  '>
                        <Link className='w-full flex font-medium' href={itm?.path}>{itm.label}</Link>
                      </li>
                    ))}
                  </ul>
                  }
                </li>
              ))}
          </ul>
          <Link className='bg-primary text-lg uppercase text-white font-semibold
                rounded-full px-7 py-4 hover:bg-secondary transition-all duration-300' href={"https://healthuaustralia.snapforms.com.au/form/referral--request-of-services-form"}>Referral</Link>
          <button onClick={()=>setIsActive(!isActive)} className='text-secondary text-4xl px-4 cursor-pointer lg:hidden '>
            {isActive ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </nav>

        </div>
        {/* mobile  menu */}
        <nav className={`absolute h-full top-0 bottom-0 bg-neutral-800 lg:hidden pt-10 z-100 transition-all ease-initial duration-700 min-w-94 min-h-screen flex flex-col gap-2
                ${isActive ? "left-0" : "-left-95" }
          `} >
        <h1 className="text-4xl font-bold text-center text-white">Menu </h1>
        <ul className=" w-full items-start justify-end border-t-3  text-white flex flex-col   ">
            {nav_items.map((item, index)=>(
                <li key={index} className=' flex flex-col w-full  cursor-pointer last:hidden relative   text-white text-base   '>
                  {item?.path ? <Link className='py-3 px-4  hover:bg-secondary transition-all duration-500 hover:text-white  ' href={item?.path}>{item.label}</Link> :
                  <div onClick={()=>handleToggle(index)} className='flex min-w-full hover:bg-secondary transition-all duration-500 hover:text-white py-3 px-4 items-center justify-between'>
                    <h2 className="flex">{item.label}</h2>
                  {activeIndex === index && !isOpen ? <IoCaretUpSharp  /> : <IoCaretDownSharp  />}
                  </div> }
                  {activeIndex === index && !isOpen && item.options && <ul className=" flex-col w-full min-w-56  transition-all duration-500  flex ">
                    {item?.options.map((itm, idx)=>(
                      <li key={idx}
                      className='flex text-center hover:bg-secondary hover:text-white py-2 px-5 ml-4 font-medium not-last:border-b border-black/20 transition-all duration-300  '>
                        <Link className='w-full flex' href={itm?.path}>{itm.label}</Link>
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