import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Normanhurst NDIS Accessible Housing",
  description: "Fully accessible 4-bedroom NDIS SIL home on Denman Parade, Normanhurst NSW 2076, wheelchair friendly with ample parking.",
}

const page = () => {
  redirect('/sil-house/sil-normanhurst')
}

export default page
