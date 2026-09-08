"use client"

import React from 'react'
import Title from 'app/utils/Title'
import { motion } from 'framer-motion'
import { TiTick } from 'react-icons/ti'
import { fadeIn } from 'app/variants'
import Link from 'next/link'
import { FiMessageSquare, FiAlertCircle, FiShield, FiPhone } from 'react-icons/fi'

const steps = [
  {
    step: "01",
    title: "Talk to Us First",
    text: "We encourage you to speak directly with your support worker, coordinator or our office. Many issues can be resolved quickly through open conversation.",
  },
  {
    step: "02",
    title: "Submit a Formal Complaint",
    text: "Use the feedback form below to submit your complaint in writing. We will acknowledge receipt within 2 business days and work to resolve it within 30 days.",
  },
  {
    step: "03",
    title: "We Investigate",
    text: "A dedicated team member will review your complaint, speak with relevant staff, gather information and keep you informed throughout the process.",
  },
  {
    step: "04",
    title: "Resolution & Follow-Up",
    text: "We will provide a written outcome, explain any actions taken, and follow up to ensure you are satisfied with the resolution.",
  },
]

const rights = [
  "Be treated with dignity, respect and fairness",
  "Have your privacy and confidentiality protected",
  "Receive a timely response to your feedback or complaint",
  "Have a support person or advocate present during the process",
  "Not experience any negative consequences for making a complaint",
  "Escalate your complaint to the NDIS Quality and Safeguards Commission at any time",
]

const externalBodies = [
  {
    name: "NDIS Quality and Safeguards Commission",
    desc: "The independent body that handles complaints about NDIS providers. You can contact them at any time, even without raising the issue with us first.",
    contact: "1800 035 544",
    link: "https://www.ndiscommission.gov.au/",
  },
  {
    name: "NDIS Quality and Safeguards Commission Online Complaint",
    desc: "Submit your complaint online directly through the NDIS Commission website.",
    contact: "Online form available",
    link: "https://www.ndiscommission.gov.au/participants/complaints-ndis-supports-and-services",
  },
  {
    name: "National Disability Advocacy Program (NDAP)",
    desc: "Free, independent advocacy support to help you raise a complaint or navigate your NDIS rights.",
    contact: "Find your local advocate",
    link: "https://www.dss.gov.au/disability-and-carers/programs-services/for-people-with-disability/national-disability-advocacy-program",
  },
  {
    name: "Office of the Australian Information Commissioner",
    desc: "If your complaint relates to how your personal information has been handled.",
    contact: "1300 363 992",
    link: "https://www.oaic.gov.au/",
  },
]

const feedbackTypes = [
  {
    icon: <FiMessageSquare className="text-3xl text-secondary" />,
    title: "Compliments",
    desc: "Let us know when a team member or service has made a positive difference. We share all compliments with our staff to recognise great work.",
  },
  {
    icon: <FiAlertCircle className="text-3xl text-primary" />,
    title: "Complaints",
    desc: "Tell us if something has gone wrong, you're unhappy with our service, or feel your rights have not been respected. All complaints are taken seriously.",
  },
  {
    icon: <FiShield className="text-3xl text-secondary" />,
    title: "Suggestions",
    desc: "Share ideas on how we can improve our services, processes or communication. Your insights help us deliver better support for all participants.",
  },
  {
    icon: <FiPhone className="text-3xl text-primary" />,
    title: "General Feedback",
    desc: "Any other feedback about your experience your support plan, communication, scheduling or anything else is welcome and valued.",
  },
]

const ParticipantFeedback = () => {
  return (
    <div className="flex flex-col w-full h-full">

      {/* Intro Section */}
      <section className="container mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <motion.div
            className="flex flex-col gap-4 w-full"
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView="show"
          >
            <Title title1="Your Voice" title2="Matters to Us" />
            <p className="text-lg text-secondary-text font-medium leading-relaxed">
              At Health U Australia, we are committed to delivering high-quality NDIS supports that respect your rights, dignity and individual goals. Your feedback  whether a compliment, concern or complaint is essential to helping us continuously improve.
            </p>
            <p className="text-lg text-secondary-text font-medium leading-relaxed">
              As a registered NDIS provider, we operate under the <strong>NDIS Practice Standards</strong> and the <strong>NDIS Code of Conduct</strong>, which require us to have a transparent, accessible and fair complaints management process. We take every piece of feedback seriously and are committed to resolving concerns promptly and fairly.
            </p>
            <p className="text-lg text-secondary-text font-medium leading-relaxed">
              Making a complaint will <strong>never affect the supports you receive</strong>. You will not be disadvantaged in any way for raising a concern.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 w-full bg-yellow-light rounded-2xl p-8"
            variants={fadeIn("left", 0.3)}
            initial="hidden"
            whileInView="show"
          >
            <h3 className="text-2xl font-bold">Quick Contact</h3>
            <p className="text-secondary-text font-medium">Prefer to speak with someone directly? Our team is here to help.</p>
            <ul className="grid gap-3">
              <li className="flex gap-2 items-start">
                <TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" />
                <span className="text-secondary-text font-medium"><strong>Phone:</strong> Call our office during business hours</span>
              </li>
              <li className="flex gap-2 items-start">
                <TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" />
                <span className="text-secondary-text font-medium"><strong>Email:</strong> Send us a written message at any time</span>
              </li>
              <li className="flex gap-2 items-start">
                <TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" />
                <span className="text-secondary-text font-medium"><strong>In Person:</strong> Speak directly with your coordinator or a manager</span>
              </li>
              <li className="flex gap-2 items-start">
                <TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" />
                <span className="text-secondary-text font-medium"><strong>Advocate:</strong> You are welcome to have a support person or advocate assist you</span>
              </li>
            </ul>
            <Link href="/contact-us" className="mt-2 text-white cursor-pointer text-base max-w-fit uppercase font-semibold px-7 py-3 rounded-full bg-primary hover:bg-secondary transition-colors duration-300">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Types of Feedback */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-5">
          <Title title1="Types of" title2="Feedback We Welcome" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {feedbackTypes.map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-3 bg-white rounded-xl p-6 shadow border border-neutral-200"
                variants={fadeIn("up", 0.1 * i)}
                initial="hidden"
                whileInView="show"
              >
                {item.icon}
                <h4 className="text-xl font-bold">{item.title}</h4>
                <p className="text-secondary-text font-medium text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="container mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row gap-10">
          <motion.div
            className="flex flex-col gap-4 w-full"
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView="show"
          >
            <Title title1="Your Rights as an" title2="NDIS Participant" />
            <p className="text-lg text-secondary-text font-medium">
              Under the NDIS Practice Standards and the Australian Charter of Healthcare Rights, you have the right to:
            </p>
            <ul className="grid gap-3">
              {rights.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <TiTick className="bg-secondary rounded-full text-white text-2xl min-w-6 min-h-6 mt-0.5" />
                  <span className="text-secondary-text font-medium text-lg">{r}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="flex flex-col gap-4 w-full"
            variants={fadeIn("left", 0.3)}
            initial="hidden"
            whileInView="show"
          >
            <Title title1="Our Complaints" title2="Process" />
            <div className="grid gap-5">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-3xl font-extrabold text-secondary min-w-10">{s.step}</span>
                  <div>
                    <h4 className="text-xl font-bold">{s.title}</h4>
                    <p className="text-secondary-text font-medium">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* CTA into form */}
      <section className="bg-primary py-10">
        <div className="container mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Ready to Share Your Feedback?</h2>
            <p className="text-white/80 text-lg mt-1">Complete the secure form below it takes less than 5 minutes.</p>
          </div>
          <Link href="https://healthuaustralia.snapforms.com.au/form/health-u-participant-feedback-form" className="text-primary cursor-pointer text-base uppercase font-bold px-8 py-3.5 rounded-full bg-white hover:bg-secondary hover:text-white transition-colors duration-300 whitespace-nowrap">
            Go to Form ↓
          </Link>
        </div>
      </section>

    </div>
  )
}

export default ParticipantFeedback