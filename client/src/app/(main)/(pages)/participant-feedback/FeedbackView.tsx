"use client"
import Title from 'utils/Title'
import { motion } from 'framer-motion'
import { TiTick } from 'react-icons/ti'
import { fadeIn } from 'app/variants'
import Link from 'next/link'
import { FiMessageSquare, FiAlertCircle, FiShield, FiPhone } from 'react-icons/fi'
import { useManagedPage } from '../_managed/useManagedPage'
import PageLoader from '../_managed/PageLoader'
import PageBanner from 'utils/PageBanner'

type Heading = { first: string; second: string }
type Content = {
  banner: string
  intro: { title1: string; title2: string; paragraphs: string[] }
  contact: { title: string; text: string; options: { label: string; text: string }[]; link: { label: string; href: string } }
  typesTitle: Heading; types: { icon: string; title: string; desc: string }[]
  rightsTitle: Heading; rightsIntro: string; rights: string[]
  processTitle: Heading; steps: { step: string; title: string; text: string }[]
  cta: { title: string; text: string; link: { label: string; href: string } }
}
const icons = { message: FiMessageSquare, alert: FiAlertCircle, shield: FiShield, phone: FiPhone }

export default function FeedbackView() {
  const { data, error, reload } = useManagedPage<Content>('participant-feedback')
  if (error) return <div role="alert" className="container mx-auto p-8">Unable to load participant feedback. <button className="underline" onClick={reload}>Try again</button></div>
  if (!data) return <PageLoader label="Loading participant feedback" />
  return <div className="flex flex-col w-full">
    <PageBanner title={data.banner} path="/participant-feedback" />
    <section className="container mx-auto px-5 py-12"><div className="flex flex-col md:flex-row gap-10 items-center">
      <motion.div className="flex flex-col gap-4 w-full" variants={fadeIn('right', 0.3)} initial="hidden" whileInView="show"><Title title1={data.intro.title1} title2={data.intro.title2} />{data.intro.paragraphs.map((paragraph, i) => <p key={i} className="text-lg text-secondary-text font-medium leading-relaxed">{paragraph}</p>)}</motion.div>
      <motion.div className="flex flex-col gap-4 w-full bg-yellow-light rounded-2xl p-8" variants={fadeIn('left', 0.3)} initial="hidden" whileInView="show"><h3 className="text-2xl font-bold">{data.contact.title}</h3><p className="text-secondary-text font-medium">{data.contact.text}</p><ul className="grid gap-3">{data.contact.options.map((option, i) => <li key={i} className="flex gap-2 items-start"><TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" /><span className="text-secondary-text font-medium"><strong>{option.label}</strong> {option.text}</span></li>)}</ul><Link href={data.contact.link.href} className="mt-2 text-white cursor-pointer text-base max-w-fit uppercase font-semibold px-7 py-3 rounded-full bg-primary hover:bg-secondary transition-colors duration-300">{data.contact.link.label}</Link></motion.div>
    </div></section>
    <section className="bg-gray-50 py-12"><div className="container mx-auto px-5"><Title title1={data.typesTitle.first} title2={data.typesTitle.second} /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">{data.types.map((item, i) => { const Icon = icons[item.icon as keyof typeof icons] ?? FiMessageSquare; return <motion.div key={i} className="flex flex-col gap-3 bg-white rounded-xl p-6 shadow border border-neutral-200" variants={fadeIn('up', 0.1 * i)} initial="hidden" whileInView="show"><Icon className={`text-3xl ${i % 2 ? 'text-primary' : 'text-secondary'}`} /><h4 className="text-xl font-bold">{item.title}</h4><p className="text-secondary-text font-medium text-base">{item.desc}</p></motion.div> })}</div></div></section>
    <section className="container mx-auto px-5 py-12"><div className="flex flex-col md:flex-row gap-10"><motion.div className="flex flex-col gap-4 w-full" variants={fadeIn('right', 0.3)} initial="hidden" whileInView="show"><Title title1={data.rightsTitle.first} title2={data.rightsTitle.second} /><p className="text-lg text-secondary-text font-medium">{data.rightsIntro}</p><ul className="grid gap-3">{data.rights.map((right, i) => <li key={i} className="flex items-start gap-2"><TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" /><span className="text-secondary-text font-medium text-lg">{right}</span></li>)}</ul></motion.div><motion.div className="flex flex-col gap-4 w-full" variants={fadeIn('left', 0.3)} initial="hidden" whileInView="show"><Title title1={data.processTitle.first} title2={data.processTitle.second} /><div className="grid gap-5">{data.steps.map((step, i) => <div key={i} className="flex gap-4 items-start"><span className="text-3xl font-extrabold text-secondary min-w-10">{step.step}</span><div><h4 className="text-xl font-bold">{step.title}</h4><p className="text-secondary-text font-medium">{step.text}</p></div></div>)}</div></motion.div></div></section>
    <section className="bg-primary py-10"><div className="container mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6"><div><h2 className="text-3xl font-extrabold text-white">{data.cta.title}</h2><p className="text-white/80 text-lg mt-1">{data.cta.text}</p></div><Link href={data.cta.link.href} className="text-primary cursor-pointer text-base uppercase font-bold px-8 py-3.5 rounded-full bg-white hover:bg-secondary hover:text-white transition-colors duration-300 whitespace-nowrap">{data.cta.link.label}</Link></div></section>
  </div>
}
