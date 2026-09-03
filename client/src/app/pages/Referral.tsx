"use client"

import { useForm, ValidationError } from '@formspree/react'
import { errorAlert, successAlert } from 'utils/alart'
import PageBanner from 'utils/PageBanner'
import Title from 'utils/Title'
import { nav_items } from 'config/page'
import React, { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

const Referral = () => {
    const [state, handleSubmit] = useForm("xnjbvngz");
    const formRef = useRef<HTMLFormElement>(null);
    const handleFormSubmit = (e: any) => {
        e.preventDefault()
        try {
            const form = e.currentTarget as HTMLFormElement;
            const name = (form.querySelector('input[name="first_name"') as HTMLFormElement)?.value || "";
            const subjectInput = form.querySelector('input[name="_subject"]') as HTMLFormElement || null;
            if (subjectInput) subjectInput.value = `New Referral Application from ${name} `;
            if (state.succeeded) {
                successAlert("Thank you for submission!")
                formRef.current?.reset();
            }
        } catch (error) {
        }
        return handleSubmit(e)
    }

    useEffect(() => {
        if (state.succeeded) {
            successAlert("Thank you for submission!");
            formRef.current?.reset();
        }
        if (state.errors) {
            // Use an error alert, not successAlert
            successAlert("Something went wrong. Please check the console.");
            console.error(state.errors);
        }
    }, [state.succeeded, state.errors]);










    const [result, setResult] = useState("");

    const onSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append("access_key", "f5dadc88-7b88-43d2-b9ea-c58114b7d603");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        setResult(data.success ? "Success!" : "Error");
        if (data.success) {
            // Use an error alert, not successAlert
            successAlert(result);
            console.error(data.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between w-full">
            <PageBanner title='Referral' path='referral' />
            <div className="container mx-auto flex flex-col my-10 items-center justify-center w-full">
                <form ref={formRef} onSubmit={onSubmit} encType="multipart/form-data"  >
                    <div className="grid  border border-neutral-300 px-10 py-5 rounded-md place-content-start my-10 w-full max-w-3xl">
                        <Title title1='Ready To' title2='Get Started?' />
                        <div className="grid gap-4 text-xl text-secondary-text">
                            <h2 className="">I am completing this for</h2>
                            <select name="completing_for" id="completing_for" required className='border-neutral-400 border p-5 rounded focus-within:outline-secondary' >
                                <option value="for_myself">Myself as the participant</option>
                                <option value="for_myself">Someone I am referring to Health U Support Services</option>
                            </select>
                        </div>
                    </div>


                    <div className="grid  border border-neutral-300 px-10 py-5 rounded-md  my-10 w-full max-w-3xl">
                        <Title title1='Participant' title2='Details' />
                        <div className="grid grid-cols-1 md:grid-cols-2 min-w-full gap-5 place-content-center">
                            <div className=" grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">First Name:</label>
                                <input type="text" name="participant_first_name" id="participant_first_name" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                                <ValidationError prefix="Participant first name" field="participant_first_name" errors={state.errors} />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Last Name:</label>
                                <input type="text" name="participant_last_name" id="participant_last_name" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Date of Birth</label>
                                <input type='date' name="participant_date_of_birth" id="date_of_birth" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full ">
                                <label className="font-medium">Gender:</label>
                                <select name="participant_gender" id="participant_gender" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="prefer not to say">Prefer not to say </option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Participant Phone Number</label>
                                <input type='phone' name="participant_phone" id="participant_phone" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Participant Email Address</label>
                                <input type='email' name="participant_email" id="participant_email" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full md:col-span-2  ">
                                <label className="font-medium">Area/Suburb</label>
                                <input type='text' name="area_suburb" id="area_suburb" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                        </div>
                    </div>
                    {/* participant details ends */}

                    <div className="grid  border border-neutral-300 px-10 py-5 rounded-md  my-10 w-full max-w-3xl">
                        <Title title1='Cultural' title2='Details' />
                        <div className="grid grid-cols-1 md:grid-cols-2 min-w-full gap-5 place-content-center">
                            <div className=" grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Participant Main Language Spoken</label>
                                <input type="text" name="participant_main_language" id="participant_main_language" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>

                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Does The Participant Require An Interpreter?</label>
                                <select name="cultural_langues" id="cultural_langues" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Relevant Culture Or Religious Considerations(If Any)?</label>
                                <input type='phone' name="participant_interpreter" id="participant_interpreter" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Does The Listed Participant Identify As An Aboriginal Or Torres Strait Islander?</label>
                                <select name="participant_identify" id="participant_identify" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {/* Cultural details ends*/}

                    <div className="grid  border border-neutral-300 px-10 py-5 rounded-md  my-10 w-full max-w-3xl">
                        <Title title1='Services' title2='Request' />
                        <div className="grid grid-cols-1 md:grid-cols-2 min-w-full gap-5 place-content-center">
                            <div className=" grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Type Of Primary Service Required:</label>
                                <select name="primary_service" id="primary_service" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select </option>
                                    {nav_items[2].options?.map((item: any, index: number) => (
                                        <option key={index} value={item.label} >{item.label}</option>
                                    ))}
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Number Of Hours Requested For Service:</label>
                                <input type="text" name="service_duration" id="service_duration" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Type Of Secondary Service Required:</label>
                                <select name="secondary_service" id="secondary_service" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select </option>
                                    {nav_items[2].options?.map((item: any, index: number) => (
                                        <option key={index} value={item.label} >{item.label}</option>
                                    ))}
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Additional Service Required:</label>
                                <select name="additional_service" id="additional_service" required className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select </option>
                                    {nav_items[2].options?.map((item: any, index: number) => (
                                        <option key={index} value={item.label} >{item.label}</option>
                                    ))}
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Participant's Relevant Conditions / Disability (Please List):</label>
                                <textarea rows={5} name="participant_conditions_disability" id="participant_conditions_disability" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Extra Information That May Assist With Preparation For Initial Appointment:</label>
                                <textarea rows={5} name="participant_extra_information" id="participant_extra_information" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Special Assessments Or Therapies Required:</label>
                                <textarea rows={5} name="participant_special_assessments" id="participant_special_assessments" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Notes For Practitioners (Additional Relevant Details):</label>
                                <textarea rows={5} name="participant_notes" id="participant_notes" required
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                            </div>
                        </div>
                    </div>
                    {/* service request ends */}

                    <div className="flex flex-col gap-y-8  border border-neutral-300 px-10 py-5 rounded-md  my-10 w-full max-w-3xl">
                        <Title title1='Contact' title2='Details' />
                        <div className="flex flex-col md:flex-row justify-between w-full h-full items-start">
                            <div className="grid gap-4">
                                <label className="flex gap-3 text-xl font-medium text-secondary-text items-center cursor-pointer ">
                                    <input type="checkbox" name="contact_phone" id="contact_phone" className=' peer hidden ' />
                                    <div className=" border-3 h-5 text-[15px] flex rounded-full  text-secondary-text peer-checked:border-primary  peer-checked:text-white peer-checked:bg-primary m-0 p-0.5 w-5 items-center justify-center">
                                        <FaCheck />
                                    </div>
                                    <h4 className="">Phone</h4>
                                </label>

                                <label className="flex gap-3 text-xl font-medium text-secondary-text items-center cursor-pointer ">
                                    <input type="checkbox" name="contact_email" id="contact_email" className=' peer hidden ' />
                                    <div className=" border-3 h-5 text-[15px] flex rounded-full  text-secondary-text peer-checked:border-primary  peer-checked:text-white peer-checked:bg-primary m-0 p-0.5 w-5 items-center justify-center">
                                        <FaCheck />
                                    </div>
                                    <h4 className="">Email</h4>
                                </label>

                                <label className="flex gap-3 text-xl font-medium text-secondary-text items-center cursor-pointer ">
                                    <input type="checkbox" name="contact_text" id="contact_text" className=' peer hidden ' />
                                    <div className=" border-3 h-5 text-[15px] flex rounded-full  text-secondary-text peer-checked:border-primary  peer-checked:text-white peer-checked:bg-primary m-0 p-0.5 w-5 items-center justify-center">
                                        <FaCheck />
                                    </div>
                                    <h4 className="">Text</h4>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 max-w-full gap-5 place-content-center">
                                <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                    <label className="font-medium">Who Should We Contact To follow up on request?</label>
                                    <select name="contactor" id="contactor" className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                        <option value="participant_nominee">Participant/Nominee</option>
                                        <option value="support_coordinator">Support Coordinator</option>
                                        <option value="other">Other </option>
                                    </select>
                                </div>
                                <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                    <input type='text' name="follow_up_name" id="follow_up_name" placeholder='Name'
                                        className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                                </div>
                                <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                    <input type='phone' name="follow_up_phone" id="follow_up_phone" placeholder='Phone'
                                        className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                                </div>
                                <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                    <input type='email' name="follow_up_email" id="follow_up_email" placeholder='Email'
                                        className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                                </div>
                            </div>

                        </div>
                        <div className="grid gap-2 text-xl text-secondary-text w-full col-span-2  ">
                            <label className="font-medium">Notes For Reception Staff (If Applicable):</label>
                            <textarea rows={5} name="reception_notes" id="reception_notes"
                                className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ' />
                        </div>
                    </div>
                    {/* participant details */}

                    <div className="grid  border border-neutral-300 px-10 py-5 rounded-md  my-10 w-full max-w-3xl">
                        <Title title1='NDIS' title2=' Information' />
                        <div className="grid grid-cols-1  min-w-full gap-5 place-content-center">
                            <div className="grid gap-2 text-xl text-secondary-text w-full  ">
                                <label className="font-medium">Participant’s NDIS Plan Type</label>
                                <select name="participant_ndis_plan" id="participant_ndis_plan" className="px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded  min-w-full ">
                                    <option >Please Select</option>
                                    <option value="male">NDIA Managed</option>
                                    <option value="female">Plan Managed</option>
                                    <option value="female">Self/Nominee-Managed</option>
                                </select>
                            </div>
                            <div className="grid gap-2 text-xl text-secondary-text w-full cursor-pointer  ">
                                <label htmlFor='ndis_document' className="font-medium">
                                    Upload Your Documents
                                </label>
                                <input type='file' name="ndis_document" id="ndis_document"
                                    className=' px-4 py-3 border-neutral-400 focus-within:outline-secondary border rounded cursor-pointer   min-w-full ' />
                            </div>
                        </div>
                    </div>
                    {/* participant details */}
                    <button disabled={state.submitting} className='text-white cursor-pointer text-xl max-w-fit uppercase font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300' type="submit">Apply Now</button>
                </form>
            </div>
        </div>
    )
}

export default Referral