"use client"
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import PageBanner from 'utils/PageBanner'
import { fadeIn } from 'app/variants'
import { useManagedPage } from '../_managed/useManagedPage'
import PageLoader from '../_managed/PageLoader'

type Content = { banner: string; images: { src: string; alt: string }[]; title: string; subtitle: string; paragraphs: string[]; servicesTitle: string; services: { name: string; detail: string }[]; links: { label: string; href: string }[] }

export default function CompassionView() {
  const { data, error, reload } = useManagedPage<Content>('compassion-in-action')
  if (error) return <div role="alert" className="container mx-auto p-8">Unable to load Compassion in Action. <button className="underline" onClick={reload}>Try again</button></div>
  if (!data) return <PageLoader label="Loading Compassion in Action" />
  return <div className="flex flex-col justify-center items-center w-full">
    <PageBanner title={data.banner} path="/compassion-in-action" />
    <div className="container max-md:px-5 flex flex-col items-center mx-auto justify-center w-full">
      <div className="flex flex-col md:flex-row-reverse my-12 gap-x-10 w-full">
        <div className="flex flex-col w-full h-full md:max-w-lg overflow-hidden items-center justify-center gap-12">
          {data.images.map((image, i) => <motion.div key={i} initial="hidden" whileInView="show" variants={fadeIn('right', 0.3)} viewport={{ once: false, amount: 0.3 }} className="flex w-full h-full">{image.src ? <Image src={image.src} alt={image.alt} width={550} height={650} className="object-cover w-full h-full inset-0 hover:scale-103 duration-500 transition-all ease-in-out rounded-md" /> : <div className="flex min-h-64 w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">Upload a photo to show it here</div>}</motion.div>)}
        </div>
        <div className="flex flex-col w-full justify-center gap-10">
          <motion.div initial="hidden" whileInView="show" variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.3 }} className="grid gap-4"><h2 className="text-[32px] font-bold">{data.title}<span className="text-secondary">{data.subtitle}</span></h2><div className="w-14 h-0.75 bg-primary items-center" /></motion.div>
          {data.paragraphs.slice(0, 2).map((paragraph, i) => <motion.p key={i} initial="hidden" whileInView="show" variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.3 }} className="w-full text-lg text-secondary-text font-medium">{paragraph}</motion.p>)}
          <motion.ul initial="hidden" whileInView="show" variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.3 }} className="grid gap-2 list-disc">
            <h4 className="text-xl my-3 text-secondary-text font-semibold">{data.servicesTitle}</h4>
            {data.services.map((service, i) => <li key={i} className="flex items-start w-full gap-2 list-disc"><div className="bg-secondary-text rounded-full mt-2.5 text-4xl h-full w-full max-h-2 max-w-2 text-white" /><p className="text-lg font-medium text-secondary-text"><strong>{service.name}</strong>{service.detail}</p></li>)}
          </motion.ul>
          {data.paragraphs.slice(2).map((paragraph, i) => <motion.p key={i} initial="hidden" whileInView="show" variants={fadeIn('left', 0.3)} viewport={{ once: false, amount: 0.3 }} className="w-full text-lg text-secondary-text font-medium">{paragraph}</motion.p>)}
        </div>
      </div>
      <motion.div initial="hidden" whileInView="show" variants={fadeIn('down', 0.3)} viewport={{ once: false, amount: 0.3 }} className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10"><div className="flex items-center justify-center gap-10">{data.links.map(link => <Link key={link.href} href={link.href} className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300">{link.label}</Link>)}</div></motion.div>
    </div>
  </div>
}
