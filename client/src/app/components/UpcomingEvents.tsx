"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaUsers } from 'react-icons/fa'
import { FaMapLocationDot } from 'react-icons/fa6'
import { upcoming_events } from 'config/page'
import Title from 'app/utils/Title'
import { fadeIn } from 'app/variants'

const UpcomingEvents = () => {
  if (!upcoming_events.length) return null

  return (
    <section className='w-full h-full bg-white'>
      <div className="container mx-auto w-full h-full items-center justify-center py-12 flex flex-col">
        <motion.div initial="hidden" whileInView="show" variants={fadeIn('up', 0.2)} viewport={{ once: false, amount: 0.3 }}>
          <Title title1="Upcoming" title2="Events" className="place-content-center place-items-center text-center" />
        </motion.div>
        <p className="text-secondary-text font-medium text-lg text-center max-w-2xl mb-8">
          Stay connected with activities and sessions designed for our participants, carers and the wider community.
        </p>

        <div className="flex flex-wrap justify-center gap-6 w-full">
          {upcoming_events.map((event, index) => (
            <motion.div key={event.id ?? index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{
                opacity: 1, y: 0,
                transition: { type: 'tween', delay: index * 0.2, duration: 0.6, ease: [0.25, 0.25, 0.25, 0.75] }
              }}
              viewport={{ once: false, amount: 0.2 }}
              className="flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="relative w-full h-56">
                <Image src={event.image} alt={event.title} className="object-cover w-full h-full" />
              </div>
              <div className="flex flex-col gap-3 p-5 grow">
                {event.audience?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {event.audience.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs font-semibold uppercase bg-secondary/15 text-secondary px-3 py-1 rounded-full">
                        <FaUsers className="text-secondary" /> {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h3 className="text-xl font-bold text-black">{event.title}</h3>
                <div className="grid gap-1.5 text-secondary-text font-medium text-sm">
                  <div className="flex items-center gap-2"><FaCalendarAlt className="text-primary shrink-0" /> {event.date}</div>
                  <div className="flex items-center gap-2"><FaClock className="text-primary shrink-0" /> {event.time}</div>
                  <div className="flex items-center gap-2"><FaMapLocationDot className="text-primary shrink-0" /> {event.location}</div>
                </div>
                <p className="text-secondary-text text-sm">{event.description}</p>
                <Link href={event.path} className="mt-auto self-start py-2.5 px-6 hover:bg-secondary transition-colors duration-300 rounded-full font-bold text-sm uppercase bg-primary text-white">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <Link href="/current-events/" className="mt-10 py-3 px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 rounded-full font-bold uppercase">
          View All Events
        </Link>
      </div>
    </section>
  )
}

export default UpcomingEvents
