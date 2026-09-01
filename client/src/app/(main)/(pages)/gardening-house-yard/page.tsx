import React from 'react'
import { Metadata } from 'next';
import GardeningHouse from 'app/pages/GardeningHouse';

export const metadata : Metadata = {
    title:"NDIS Gardening & Home Maintenance Services | Health U Support",
    description:"Health U Support offers NDIS gardening, yard, and home maintenance to keep homes safe, clean, and accessible. Tailored care.",
}
const page = () => {
  return (
    <GardeningHouse/>
  )
}

export default page