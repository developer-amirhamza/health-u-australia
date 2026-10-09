import Training from 'app/pages/Training'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Training | NDIS Modules & Resources for Placement Students",
  description: "Access required NDIS Worker Orientation and induction training, plus key NDIS Quality and Safeguards Commission resources for Health U Australia placement students.",
};

const page = () => {
  return (
    <Training />
  )
}

export default page
