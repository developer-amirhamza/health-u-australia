import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import BelmoreStreetClient from './BelmoreStreetClient'

export const metadata: Metadata = {
  title: "Belmore Street Ryde – NDIS SIL Housing",
  description: "3-bedroom NDIS SIL, STA, MTA and respite housing on Belmore Street, Ryde NSW 2112. Fully accessible with urgent placement available.",
}

const page = () => {
  // redirect('/sil-house/sil-belmore')
  return <BelmoreStreetClient/>
}

export default page
