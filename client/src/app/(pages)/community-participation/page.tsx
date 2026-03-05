import React from 'react'
import { Metadata } from 'next';
import CommunityContent from 'app/pages/CommunityContent';


export const metadata : Metadata = {
    title:"NDIS Community Participation for Everyone",
    description:"Find NDIS community participation options and social programs for NDIS participants. Unlock the benefits of NDIS social participation programs to build stronger connections.",
}

const page = () => {
  return (
    <CommunityContent/>
  )
}

export default page