"use client"
import { call_icon, clack_icon, email_icon } from 'assets'
import Image from 'next/image'
import React from 'react'
import { useHomeContent } from './HomeContentContext'


const NewsLetter = () => {
  const contact = useHomeContent()?.contact
  const phone1 = contact?.phone1 || '0481 707 758'
  const phone2 = contact?.phone2 || '0431 377 132'
  const email = contact?.email || 'info@healthuau.com'
  return (
    <section className="flex w-full h-f  bg-primary">
        <div className="container grid grid-cols-1  md:grid-cols-3 py-14 gap-6 place-items-center ">
            <div className="flex items-center justify-start w-full md:not-last:border-r gap-3  border-white ">
                <Image src={call_icon} alt='Health u Australia'/>
                <div className="grid gap-1 w-full">
                    <span className="text-lg text-white font-semibold">Call Today Now</span>
                    <div className="flex flex-wrap items-center w-full text-white font-bold gap-1 text-base xl:text-lg">
                        <a className='whitespace-nowrap hover:text-black hover:underline transition-colors duration-500' href={`tel:${phone1.replace(/[^\d+]/g, '')}`}>{phone1}</a> /
                        <a className='whitespace-nowrap hover:text-black hover:underline transition-colors duration-500' href={`tel:${phone2.replace(/[^\d+]/g, '')}`}>{phone2}</a>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-start w-full md:not-last:border-r gap-3  border-white ">
                <Image src={email_icon} alt='Health u Australia'/>
                <div className="grid gap-1 w-full">
                    <span className="text-lg text-white font-semibold">Email Us On</span>
                        <a className="flex items-center w-full text-white font-bold gap-1 text-base xl:text-lg break-all hover:text-black hover:underline transition-colors duration-500 "
                         href={`mailto:${email}`}>{email}</a>
                </div>
            </div>

            <div className="flex items-center justify-start w-full md:not-last:border-r gap-3  border-white ">
                <Image src={clack_icon} alt='Health u Australia'/>
                <div className="grid gap-1 w-full">
                    <span className="text-lg text-white font-semibold">Working Hour</span>
                    <h3 className="flex items-center w-full text-white font-bold gap-1 text-2xl">{contact?.hours || '8:00am – 6:00pm'}</h3>
                </div>
            </div>
        </div>
    </section>
  )
}

export default NewsLetter
