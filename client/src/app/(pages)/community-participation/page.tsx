import React from 'react'
import { Metadata } from 'next';
import CommunityContent from 'app/pages/CommunityContent';


export const metadata : Metadata = {
    title:"NDIS Community Participation",
    description:"Find NDIS community participation options and social programs that help participants build skills, confidence and stronger connections.",
}

const page = () => {
  return (
    <CommunityContent/>
  )
}

export default page