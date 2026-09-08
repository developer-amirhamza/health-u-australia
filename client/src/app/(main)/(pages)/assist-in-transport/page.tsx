import React from 'react'
import { Metadata } from 'next';
import AssistInTransport from 'app/pages/AssistInTransport';

export const metadata: Metadata = {
    title:"NDIS Transport Assistance in Sydney",
    description:"Explore NDIS Transport Assistance to enhance your independence and well-being with reliable and accessible transport services.",
};
const page = () => {
  return (
    <AssistInTransport/>
  )
}

export default page