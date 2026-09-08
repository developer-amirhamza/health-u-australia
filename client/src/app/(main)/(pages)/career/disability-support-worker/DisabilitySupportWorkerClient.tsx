"use client"
import Title from 'app/utils/Title'
import Link from 'next/link'
import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'

const DisabilitySupportWorkerClient = () => {
  return (
    <main className="bg-amber-100 w-full h-full flex items-center justify-center">
      <div className="container text-secondary-text mx-auto place-content-center place-items-center w-full h-full grid gap-5">
        <Title title1='Disability Support Worker (Nursing background) Ryde / Hornsby/ Northern Districts ONLY ' title2=''
          className={`place-content-center place-items-center text-secondary-text text-center uppercase `} />
        <span className="font-semibold">12th May, 2026</span>
        <div className="bg-amber-50 w-full grid h-full p-10 gap-4 rounded">
          <h2 className="text-lg font-semibold">
            Disability Support Worker (Nursing background) Ryde / Hornsby/ Northern Districts ONLY
          </h2>
          <span className="text-lg flex "> <strong className="font-semibold">Pay:</strong>  A$35.00 - A$45.00 per hour  </span>
          <h3 className="font-semibold text-lg">Job description:</h3>
          <span className="font-semibold">About us </span>
          <p>Looking to make a real difference in the lives of others?</p>
          <p className="">
            Health U Australia is a registered NDIS service provider with experience in recruiting a range of allied health professionals such as nurses, social workers as well as mental health, aged care,
            and disability support workers. With over ten years’ experience working in community health, mental health and disability sectors, our team have developed the skills to deliver high quality, in-person centered care for children, adolescents and adults.
          </p>
          <p className="font-semibold italic">
            At Health U Australia, we are more than just an NDIS service provider, we are committed to giving back to the community through a range of community service initiatives.
          </p>
          <p className="">Visit our website: <a className='text-blue-800' href="https://www.healthuau.com.au">www.healthuau.com.au</a></p>
          <p className="font-semibold">The role: </p>
          <p>
            Your role as a disability and mental health support worker will include supporting and/or accompanying individuals 1:1 in day programs at home or within the community. Using a person-cantered care approach to encourage independence, you will provide support and general assistance with day-to-day or routine tasks or as required by your client. Your clients should feel supported and in control as you provide guidance through rapport building, listening and attending to them.
          </p>
          <p className="font-medium">Your qualifications & experience may include: </p>
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
          <p >We have Part-time and full-time roles available (and preferable) however casual roles will also be considered. This role is suitable for part time university/TAFE students with a flexible schedule.  </p>
          <p className="font-medium">
            Tasks & responsibilities may include, but are not limited to:
          </p>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">Assistance with daily living (i.e., medication prompting, housekeeping, meal preparation)  </li>
            <li className="list-disc ">Transport (attend medical or health related appointments)   </li>
            <li className="list-disc ">Community Access (grocery shopping, outing and activities engagement)  </li>
            <li className="list-disc ">Personal care (personal hygiene, toileting, showering, dressing - transfer or manual handling may require)   </li>
            <li className="list-disc  ">Follow behavioral support & NDIS care plans to understand our participants!  </li>
            <li className="list-disc ">Fluent English speaking, easy going and patience is a must. </li>
            <li className="list-disc font-semibold">Willing to travel to various locations (company vehicle can be provided)   </li>
            <li className="list-disc font-semibold">Comfortable with performing light cleaning tasks as part of their role  </li>
          </ul>
          <p>**This role requires availability for a fixed schedule assigned by Health U. Flexibility to work within the provided schedule is essential. </p>
          <div className="font-semibold">Benefits </div>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">Competitive salary!  </li>
            <li className="list-disc ">Hands on training and mentoring by team leader.  </li>
            <li className="list-disc ">Weekly roster, weekly pay schedule   </li>
            <li className="list-disc ">Flexible hours (morning and afternoon)    </li>
            <li className="list-disc  ">Great team culture  </li>
            <li className="list-disc ">Consistent support is available for any of your concerns.  </li>
            <li className="list-disc font-semibold">We encourage you to speak up!    </li>
          </ul>
          <p>Please note: We are committed to filling this role quickly, so while this role has a closing date, we will be reviewing applications as they come in and may interview suitable candidates prior to the closing date. </p>
          <span className="font-semibold">Job Type: Casual </span>
          <span className="font-semibold">Benefits </span>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">Company car  </li>
          </ul>

          <span className="font-semibold">Application Question(s):  </span>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">Do you currently live within 30 minutes driving distance from Ryde/Hornsby area?   </li>
            <li className=" list-disc ">Are you confident and willing to provide personal care supports (e.g. showering, toileting, continence care, manual handling/transfers)?    </li>
          </ul>

          <span className="font-semibold">Licence/Certification: </span>
          <ul className=" pl-10 grid gap-4 ">
            <li className=" list-disc ">driver license and own car (Required)   </li>
          </ul>

          <span className="text-lg flex "> <strong className="font-semibold"> Work Location:</strong>  In person   </span>
          <Link href={"https://healthuaustralia.snapforms.com.au/form/career-request-to-health-u-australia"} className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto mt-6 items-center text-2xl flex gap-5 rounded-full shadow hover:bg-gray-100 transition">
            Apply Now
            <FaArrowRightLong />
          </Link>
        </div>
      </div>
    </main>
  )
}

export default DisabilitySupportWorkerClient