"use client"
import Title from 'app/utils/Title'
import Link from 'next/link'
import { FaArrowRightLong } from 'react-icons/fa6'

const page = () => {
  return (
    <main className="bg-amber-50 w-full h-full flex items-center justify-center">
      <div className="container text-secondary-text mx-auto place-content-center place-items-center w-full h-full grid gap-5">
        <Title title1='Domestic Cleaner (Applicants must reside in the Northern Beaches area) ' title2=''
          className={`place-content-center place-items-center text-secondary-text text-center uppercase `} />
        <span className="font-semibold">12th May, 2026</span>
        <div className="bg-amber-100 w-full grid h-full p-10 gap-4 rounded">
          <h1 className="text-lg font-semibold">
            Domestic Cleaner (Applicants must reside in the Northern Beaches area)
          </h1>
          <span className="text-lg flex "> <h1 className="font-semibold">Pay:</h1> A$38.00 - A$48.00 per hour </span>
          <h1 className="font-semibold text-lg">Job description:</h1>
          <p>Health U Australia is hiring a casual/temporary hours Cleaner role in lower North Shore and Northern Beaches areas in NSW. Apply now to be part of our team. </p>
          <span className="font-semibold">Job summary:  </span>
          <ul className=" pl-10 grid gap-4 ">
            <li className="font-semibold list-disc ">Assistant In Nursing (desirable) </li>
            <li className="list-disc ">Certificate III individual support or aged care (or relevant)  </li>
            <li className="list-disc ">Certificate/Diploma in mental health, counselling, social work or psychology </li>
            <li className="list-disc font-semibold">Valid driver’s license and reliable car with insurance  </li>
            <li className="list-disc font-semibold ">Experience in the disability, aged care or mental health sector  </li>
            <li className="list-disc ">Current Police Check </li>
            <li className="list-disc ">Covid-19 vaccination certificate  </li>
            <li className="list-disc ">Current CPR/First Aid certificate  </li>
          </ul>
          <p className="font-semibold italic">**Driver license and being able to drive are mandatory** </p>
          <p >
            Looking to make a real difference in the lives of others? Health U Australia is a registered disability service provider with experience in recruiting a range of allied health professionals such as nurses, social workers as well as mental health, aged care, and disability support workers. With over ten years’ experience working in community health, mental health and disability sectors, our team have developed the skills to deliver high quality, in-person centred care for children, adolescents, and adults.
          </p>
          <p className="">Visit our website: <a className='text-blue-800' href="http://www.healthuau.com.au">www.healthuau.com.au</a></p>
          <p className="font-semibold">The role: </p>

          <p className="font-medium">Tasks & responsibilities may include (but are not limited to):  </p>
          <ul className=" pl-10 grid gap-4 ">
            <li className="font-semibold list-disc ">MUST - WILLING TO DO CLEANING  </li>
            <li className="list-disc ">Assistance with daily living (i.e., medication prompting, housekeeping, meal preparation)  </li>
            <li className="list-disc ">Transport (attend medical or health related appointments)  </li>
            <li className="list-disc font-semibold">Community Access (grocery shopping, outing and activities engagement)  </li>
            <li className="list-disc font-semibold ">Personal care (personal hygiene, toileting, showering, dressing) </li>
            <li className="list-disc ">Follow behavioural support & NDIS care plans to understand our participants </li>
            <li className="list-disc ">Fluent English speaking, easy going and patience is a must. </li>
            <li className="list-disc ">Competitive salary with travel allowance  </li>
            <li className="list-disc ">Hands on training and mentoring by team leader </li>
            <li className="list-disc "> Weekly roster, weekly pay schedule  </li>
            <li className="list-disc ">Flexible hours (morning, afternoon)  </li>
            <li className="list-disc ">Friendly, open, and honest team culture   </li>
            <li className="list-disc ">Consistent support available.   </li>
            <li className="list-disc ">We value transparency, communication, and expression of any concerns/feedback you may have as team member Please note: We are committed to filling this role quickly, so while this role has a closing date, we will be reviewing applications as they come in and may interview suitable candidates prior to the closing date.  </li>
          </ul>
          <span className="font-semibold">Job Types: Part-time, Casual </span>
          <span className="font-semibold">Work Authorisation: </span>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">Australia (Preferred)  </li>
          </ul>
          <span className="text-lg flex "> <h1 className="font-semibold">Work Location:</h1>  In person   </span>
          <Link href={"https://healthuaustralia.snapforms.com.au/form/career-request-to-health-u-australia"} className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto mt-6 items-center text-2xl flex gap-5 rounded-full shadow hover:bg-gray-100 transition">
            Apply Now
            <FaArrowRightLong />
          </Link>
        </div>
      </div>
    </main>
  )
}

export default page