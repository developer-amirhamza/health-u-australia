import React from 'react'
import { Metadata } from 'next';
import CurrentEvents from 'app/pages/CurrentEvent';


export const metadata: Metadata = {
    title:"Stay Updated with Current Events | Health U Australia",
    description:"Discover the latest health events, wellness workshops, and news updates. Join Health U Australia to better health."
};
const page = () => {
  return (
    <CurrentEvents/>
  )
}

export default page