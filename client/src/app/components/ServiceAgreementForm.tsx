"use client"
import React, { useMemo } from 'react'
import { useForm, useFieldArray, useWatch, Controller, type SubmitHandler } from 'react-hook-form'
import Image from 'next/image'
import logo from "assets/logo.png"
import SignaturePad from './SignaturePad'

const SCHEDULE_OPTIONS = [
  'Assistance in Daily Living',
  'Community Access Support',
  'House Cleaning and Other Household Activities',
  'House or Yard Maintenance',
  'Support Coordination',
  'Short Term Respite',
]

const RELATIONSHIP_OPTIONS = ['Plan Nominee', 'Parent', 'Guardian', 'Support Coordinator', 'Friend']
const FREQUENCY_OPTIONS = ['Weekly', 'Fortnightly', 'Monthly', 'One-off']
const DAY_OPTIONS = ['Any Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type SupportItem = {
  itemCode: string
  itemName: string
  unitPrice: number
  frequency: string
  dayOfWeek: string
  hoursPerService: number
  qtyPerPeriod: number
  startDate: string
  endDate: string
  notes: string
}

type FormValues = {
  participantName: string
  participantNdisNumber: string
  participantRepName: string
  agreementStartDate: string
  agreementEndDate: string

  supportsProvided: string[]
  livesAlone: 'yes' | 'no' | ''

  managementType: 'self' | 'ndia' | 'plan' | ''
  planManagerName: string
  planManagerEmail: string

  cancellationPolicyAcknowledged: boolean

  consentInfoConfidential: boolean
  consentChangeAnytime: boolean
  consentMedication: 'yes' | 'no' | ''
  consentMoneyManagement: 'yes' | 'no' | ''
  consentPhotosService: 'yes' | 'no' | ''
  consentPhotosMedia: 'yes' | 'no' | ''
  consentPublishFeedback: 'yes' | 'no' | ''

  contactAddress: string
  contactPhone: string
  contactEmail: string
  hasAlternativeContact: 'yes' | 'no' | ''
  altRelationship: string[]
  altContactName: string
  altContactNumber: string
  altContactEmail: string

  orgContactName: string
  orgPhone: string
  orgEmail: string
  orgPostalAddress: string

  quoteNumber: string
  quoteDate: string
  planStartDate: string
  planEndDate: string
  preparedBy: string
  contactPerson: string
  applyGst: boolean
  items: SupportItem[]

  agreementExplained: boolean
  participantSignature: string
  participantSignatureName: string
  participantSignedDate: string
  providerSignature: string
  providerSignatureName: string
  providerSignedDate: string
}

const emptyItem: SupportItem = {
  itemCode: '',
  itemName: '',
  unitPrice: 0,
  frequency: 'Weekly',
  dayOfWeek: 'Any Day',
  hoursPerService: 0,
  qtyPerPeriod: 0,
  startDate: '',
  endDate: '',
  notes: '',
}

const defaultValues: FormValues = {
  participantName: '',
  participantNdisNumber: '',
  participantRepName: '',
  agreementStartDate: '',
  agreementEndDate: '',

  supportsProvided: [],
  livesAlone: '',

  managementType: '',
  planManagerName: '',
  planManagerEmail: '',

  cancellationPolicyAcknowledged: false,

  consentInfoConfidential: false,
  consentChangeAnytime: false,
  consentMedication: '',
  consentMoneyManagement: '',
  consentPhotosService: '',
  consentPhotosMedia: '',
  consentPublishFeedback: '',

  contactAddress: '',
  contactPhone: '',
  contactEmail: '',
  hasAlternativeContact: '',
  altRelationship: [],
  altContactName: '',
  altContactNumber: '',
  altContactEmail: '',

  orgContactName: 'Health U Australia',
  orgPhone: '0481 707 758',
  orgEmail: 'info@healthuau.com',
  orgPostalAddress: 'Shop MM20, Level 2, 109-129 Blaxland Road, Ryde NSW 2112',

  quoteNumber: '',
  quoteDate: new Date().toISOString().slice(0, 10),
  planStartDate: '',
  planEndDate: '',
  preparedBy: '',
  contactPerson: '',
  applyGst: false,
  items: [{ ...emptyItem }],

  agreementExplained: false,
  participantSignature: '',
  participantSignatureName: '',
  participantSignedDate: '',
  providerSignature: '',
  providerSignatureName: '',
  providerSignedDate: '',
}

const inputCls = 'w-full text-neutral-700 border border-neutral-300 py-2.5 px-4 text-base rounded outline-none focus:border-secondary transition-colors bg-white'
const smallInputCls = 'w-full text-neutral-700 border border-neutral-300 py-1.5 px-2 text-sm rounded outline-none focus:border-secondary transition-colors bg-white'
const labelCls = 'text-sm font-semibold text-secondary-text mb-1 flex items-center gap-1'
const sectionTitleCls = 'text-xl sm:text-2xl font-bold text-primary mt-12 mb-4 border-b border-neutral-200 pb-2'
const subTitleCls = 'text-base font-bold text-secondary-text mt-6 mb-2'
const cardCls = 'grid gap-5 w-full rounded border border-neutral-300 shadow-sm p-5 sm:p-8 bg-white'
const staticTextCls = 'text-sm text-neutral-600 leading-relaxed'
const checkboxRowCls = 'flex items-center gap-2 text-sm text-neutral-700'

const Req = () => <span className="text-primary">*</span>

const money = (n: number) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(Number.isFinite(n) ? n : 0)

const weeksBetween = (start: string, end: string) => {
  if (!start || !end) return 0
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return 0
  return Math.round(((e - s) / (1000 * 60 * 60 * 24 * 7)) * 10) / 10
}

const YesNo = ({
  name,
  control,
  label,
}: {
  name: keyof FormValues
  control: any
  label: React.ReactNode
}) => (
  <Controller
    name={name as any}
    control={control}
    render={({ field }) => (
      <div className="flex flex-col gap-2 py-2 border-b border-neutral-100 last:border-b-0">
        <p className="text-sm text-neutral-700">{label} <Req /></p>
        <div className="flex gap-6">
          <label className={checkboxRowCls}>
            <input
              type="radio"
              checked={field.value === 'yes'}
              onChange={() => field.onChange('yes')}
            />
            Yes
          </label>
          <label className={checkboxRowCls}>
            <input
              type="radio"
              checked={field.value === 'no'}
              onChange={() => field.onChange('no')}
            />
            No
          </label>
        </div>
      </div>
    )}
  />
)

const ServiceAgreementForm = () => {
  const { register, control, handleSubmit, watch, reset } = useForm<FormValues>({ defaultValues })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const watchedItems = useWatch({ control, name: 'items' })
  const applyGst = useWatch({ control, name: 'applyGst' })
  const participantName = watch('participantName')
  const participantNdisNumber = watch('participantNdisNumber')
  const managementType = watch('managementType')
  const hasAlternativeContact = watch('hasAlternativeContact')

  const computedRows = useMemo(
    () =>
      (watchedItems || []).map((item) => {
        const unitPrice = Number(item?.unitPrice) || 0
        const hours = Number(item?.hoursPerService) || 0
        const qty = Number(item?.qtyPerPeriod) || 0
        return {
          weeks: weeksBetween(item?.startDate, item?.endDate),
          lineTotal: unitPrice * hours * qty,
        }
      }),
    [watchedItems]
  )

  const subtotal = computedRows.reduce((sum, r) => sum + r.lineTotal, 0)
  const gstAmount = applyGst ? subtotal * 0.1 : 0
  const grandTotal = subtotal + gstAmount

  const onDownload: SubmitHandler<FormValues> = () => {
    window.print()
  }

  return (
    <form onSubmit={handleSubmit(onDownload)} className="container mx-auto max-w-5xl pb-24">
      <style jsx global>{`
        @media print {
          header, footer, .fixed { display: none !important; }
          body { background: #fff !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="print:hidden sticky top-0 z-40 -mx-5 sm:-mx-10 mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur border-b border-neutral-200 px-5 sm:px-10 py-3">
        <p className="text-sm text-secondary-text">
          Fill in the agreement below, then download a client-ready PDF.
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset(defaultValues)}
            className="text-sm font-semibold text-secondary-text hover:text-primary transition-colors cursor-pointer"
          >
            Reset form
          </button>
          <button
            type="button"
            disabled
            title="Sending will be enabled once this tool is connected to the backend"
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full bg-neutral-300 cursor-not-allowed"
          >
            Send to client (coming soon)
          </button>
          <button
            type="submit"
            className="text-white cursor-pointer text-sm font-semibold px-5 py-2.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Document header */}
      <div className="flex flex-col items-center text-center gap-3 mb-6">
        <Image src={logo} alt="Health U logo" className="w-40 h-auto" />
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-text">
          NDIS SERVICE AGREEMENT &amp; CONSENT FORM
        </h1>
      </div>

      {/* 1. Parties */}
      <h2 className={sectionTitleCls}>1. Parties</h2>
      <div className={cardCls}>
        <p className={staticTextCls}>This Service Agreement is for:</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Participant Name <Req /></label>
            <input className={inputCls} {...register('participantName', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Participant NDIS Number <Req /></label>
            <input className={inputCls} {...register('participantNdisNumber', { required: true })} />
          </div>
        </div>
        <p className={staticTextCls}>a participant in the National Disability Insurance Scheme, and is made between:</p>
        <div>
          <label className={labelCls}>Participant / Representative Name <Req /></label>
          <input className={inputCls} {...register('participantRepName', { required: true })} />
        </div>
        <p className={staticTextCls}>and</p>
        <div>
          <label className={labelCls}>Provider</label>
          <input className={`${inputCls} bg-neutral-100`} value="Health U Australia" disabled readOnly />
        </div>
        <p className={staticTextCls}>This Service Agreement will commence on:</p>
        <div className="grid sm:grid-cols-2 gap-5 items-end">
          <div>
            <label className={labelCls}>Start date <Req /></label>
            <input type="date" className={inputCls} {...register('agreementStartDate', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>to end date <Req /></label>
            <input type="date" className={inputCls} {...register('agreementEndDate', { required: true })} />
          </div>
        </div>
      </div>

      {/* 2. The NDIS and this Service Agreement */}
      <h2 className={sectionTitleCls}>2. The NDIS and this Service Agreement</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>
          This Agreement is made in accordance with the rules and objectives of the National Disability
          Insurance Scheme (NDIS) and other applicable laws, such as the Australian Consumer Law (see section 4.1 below).
        </p>
        <p>A copy of the client&apos;s NDIS Plan is not attached to this Service Agreement.</p>
        <p>
          The participant and the service provider agree that this Agreement is in accordance with the main
          ideas of the NDIS. These ideas include things like having more choices, achieving personal goals and
          taking part in the community.
        </p>
        <p>The parties agree that this Service Agreement is made in the context of the NDIS, which is a scheme that aims to:</p>
        <ul className="list-disc pl-5">
          <li>Support the independence and social and economic participation of people with disability; and</li>
          <li>Enable people with disability to exercise choice and control in pursuing their goals and the planning and delivery of their supports.</li>
        </ul>
      </div>

      {/* 3. Schedule of supports checklist */}
      <h2 className={sectionTitleCls}>3. Schedule of Supports</h2>
      <div className={cardCls}>
        <p className="text-sm text-neutral-700">Health U Australia agrees to provide the participant for the period stated in Section 1. <Req /></p>
        <div className="grid sm:grid-cols-2 gap-2">
          {SCHEDULE_OPTIONS.map((opt) => (
            <label key={opt} className={checkboxRowCls}>
              <input type="checkbox" value={opt} {...register('supportsProvided')} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* 4. Health U Australia Responsibilities */}
      <h2 className={sectionTitleCls}>4. Health U Australia Responsibilities</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>Health U Australia agrees to:</p>
        <ol className="list-[lower-alpha] pl-5 flex flex-col gap-2">
          <li>Communicate with you openly, honestly and promptly.</li>
          <li>Treat you with kindness, courtesy and respect.</li>
          <li>Partner with you on decisions about how your services and supports are provided.</li>
          <li>Review the provision of services and support with you, at least annually, and more often if required.</li>
          <li>Provide services and supports that meet your needs, circumstances, preferences and goals.</li>
          <li>Provide you with the opportunity to select your preferred support workers to support you on your preferred days and times.</li>
          <li>Provide you with a minimum of 2 days&apos; notice, where possible, if we have to change a scheduled appointment to provide your supports.</li>
          <li>Provide supports that consider your safety.</li>
          <li>Implement and maintain safeguarding policies and procedures to uphold your human and legal rights.</li>
          <li>Complete an individual Personal Emergency Preparation Plan where we will partner with you to review your needs and risks and design a plan that keeps you safe during an emergency or disaster.</li>
          <li>Complete a trial of your Personal Emergency Preparation Plan and seek your input to improve this plan.</li>
          <li>Follow incident management procedures in accordance with our Incident Management Policy to ensure everyone&apos;s safety and provide you with information about the process we follow.</li>
          <li>Declare and manage potential, perceived and actual conflicts of interest in accordance with our Conflict of Interest Policy.</li>
          <li>Explain, in a way that you understand, how you can provide feedback and lodge a complaint about our services internally to us and also to a third party (e.g. NDIS Commission).</li>
          <li>Listen to your feedback and resolve problems quickly.</li>
          <li>Never offer or give you financial advice or recommendations.</li>
          <li>Review your Support Plan and this Service Agreement whenever your circumstances change and provide you with updated versions for your records.</li>
          <li>Conduct appropriate worker screening and maintain processes for worker training and supervision to ensure our workforce is caring, compassionate, skilled and competent.</li>
          <li>Maintain processes to protect your privacy and personal information.</li>
          <li>Issue you with clear and accurate invoices and statements relating to costs and payments required.</li>
          <li>Give you the required notice if we must end this Service Agreement (see also under &lsquo;Ending this Service Agreement&rsquo; below).</li>
        </ol>

        <p className={subTitleCls}>4.1 Client Living Alone and Receiving Personal Care Support from a Sole Worker</p>
        <Controller
          name="livesAlone"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <label className={checkboxRowCls}>
                <input type="radio" checked={field.value === 'yes'} onChange={() => field.onChange('yes')} />
                Participant lives alone and receives Personal Care Support from a Sole Worker
              </label>
              <label className={checkboxRowCls}>
                <input type="radio" checked={field.value === 'no'} onChange={() => field.onChange('no')} />
                Participant DOES NOT live alone and receive Personal Care Support from a Sole Worker
              </label>
            </div>
          )}
        />
        <p>
          Where applicable, Health U Australia will comply with the additional condition of registration,
          in accordance with s 73G of the NDIS Act, in relation to providing assistance with daily personal
          activities to participants who live alone, including conducting regular client risk assessments,
          ongoing support worker monitoring and supervision, and face-to-face in-home visits at an appropriate frequency.
        </p>

        <p className={subTitleCls}>4.2 Australian Consumer Law</p>
        <p>
          Health U Australia will comply with Australian Consumer Law and other requirements of the
          Competition and Consumer Act 2010 (Cth). Our services are fit-for-purpose and match the description provided.
        </p>

        <p className={subTitleCls}>4.3 NDIS Code of Conduct</p>
        <p>Health U Australia and our workers comply with the NDIS Code of Conduct.</p>

        <p className={subTitleCls}>4.4 Reportable Incidents</p>
        <p>
          All reportable incidents are managed in accordance with our Incident Management Policy and
          Reportable Incident Management Procedure, in compliance with the NDIS (Incident Management and
          Reportable Incident) Rules 2018.
        </p>
      </div>

      {/* 5. Responsibilities of the participant */}
      <h2 className={sectionTitleCls}>5. Responsibilities of the Participant / Participant Representative</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>The participant / participant&apos;s representative agrees to:</p>
        <ol className="list-[lower-alpha] pl-5 flex flex-col gap-2">
          <li>Respect the rights of workers, ensuring their workplace is safe and healthy and free from harassment.</li>
          <li>Abide by the terms of your Agreement with us.</li>
          <li>Understand that your needs may change, and with this, your services may need to change to meet your needs.</li>
          <li>Accept responsibility for your actions and choices, even though some choices may involve risk.</li>
          <li>Tell us if you have problems with the care and services you are receiving.</li>
          <li>Give us enough information to develop, deliver and review your Support Plan.</li>
          <li>Care for your health and wellbeing as much as you are able.</li>
          <li>Provide us with information that will help us better meet your needs.</li>
          <li>Provide us with a minimum of 7 days&apos; notice when you know you will not be home for your scheduled service.</li>
          <li>Be aware that our workers are only authorised to perform the agreed number of hours and tasks outlined in your Service Agreement.</li>
          <li>Participate in safety assessments of your home.</li>
          <li>Ensure pets are controlled during service provision.</li>
          <li>Provide a smoke-free working environment.</li>
          <li>Pay the agreed amount for the services provided.</li>
          <li>Tell us in writing (where able) and give us notice before the day you intend to stop receiving services from us.</li>
          <li>Inform us if you wish to opt-out when asked.</li>
          <li>Inform us about how you wish the supports to be delivered to meet your needs.</li>
          <li>Treat our workers with courtesy and respect.</li>
          <li>Talk to us if you have any concerns about the services and supports we are providing.</li>
          <li>Give Health U Australia a minimum of 7 days&apos; notice if you cannot make a scheduled appointment; if notice is not provided, the cancellation policy will apply.</li>
          <li>Give Health U Australia the required notice if you need to end the Service Agreement.</li>
          <li>Let us know immediately if your NDIS Plan is suspended or replaced by a new NDIS Plan or if you stop being a participant in the NDIS.</li>
        </ol>
      </div>

      {/* 6. Pricing and payments */}
      <h2 className={sectionTitleCls}>6. Pricing and Payments</h2>
      <div className={cardCls}>
        <p className={staticTextCls}>
          Health U Australia will charge within the price limits and pricing arrangements specified in the
          NDIS Pricing Arrangements and Price Limits. We will seek payment for the provision of services and
          supports after you confirm satisfactory delivery. The supports and their prices are set out in the
          attached Schedule of Supports. All prices are GST inclusive (if applicable) and include the cost of
          providing the supports. Additional expenses are the responsibility of the participant / participant&apos;s
          representative and are not included in the cost of the supports.
        </p>
        <Controller
          name="managementType"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input type="radio" className="mt-1" checked={field.value === 'self'} onChange={() => field.onChange('self')} />
                <span><strong>SELF MANAGED</strong> — the participant / representative has chosen to self-manage the funding. Health U Australia will send an invoice for the participant / representative to pay by direct debit / EFT within 7 days.</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input type="radio" className="mt-1" checked={field.value === 'ndia'} onChange={() => field.onChange('ndia')} />
                <span><strong>NDIA MANAGED</strong> — the client has nominated the NDIA to manage the funding. Health U Australia will claim payment from the NDIA.</span>
              </label>
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input type="radio" className="mt-1" checked={field.value === 'plan'} onChange={() => field.onChange('plan')} />
                <span><strong>PLAN MANAGED</strong> — the client has nominated a Plan Management Provider to manage the funding. Health U Australia will claim payment from the plan manager.</span>
              </label>
            </div>
          )}
        />
        {managementType === 'plan' && (
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Plan Manager Provider Name <Req /></label>
              <input className={inputCls} {...register('planManagerName')} />
            </div>
            <div>
              <label className={labelCls}>Plan Manager Email Address</label>
              <input type="email" className={inputCls} {...register('planManagerEmail')} />
            </div>
          </div>
        )}
      </div>

      {/* 7 & 8 */}
      <h2 className={sectionTitleCls}>7. Changes to this Service Agreement</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>
          If changes to the supports or their delivery are required, the parties agree to discuss and review
          this Service Agreement. Any changes will be in writing, signed and dated by the parties.
        </p>
      </div>

      <h2 className={sectionTitleCls}>8. Ending this Service Agreement</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>
          Should either party wish to end this Service Agreement they must give 4 weeks&apos; notice. If either
          party seriously breaches this Service Agreement the requirement of notice will be waived.
        </p>
      </div>

      {/* 9. Feedback */}
      <h2 className={sectionTitleCls}>9. Feedback, Complaints and Disputes</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>
          If you, as the participant, or your representative, wish to provide us with feedback, or lodge a
          complaint in relation to services received from Health U Australia, you can talk to us on{' '}
          {watch('orgPhone')} or email {watch('orgEmail')}.
        </p>
        <p>
          You can also make an anonymous complaint by completing the Anonymous Complaints and Feedback Form
          or by phoning our Support Service Manager.
        </p>
        <p>
          If you are not satisfied with the handling of the complaint, you can contact the NDIS Commission at
          any time by calling 1800 035 544, visiting one of their offices in person, or accessing the NDIS website.
        </p>
      </div>

      {/* 10. GST */}
      <h2 className={sectionTitleCls}>10. Goods and Services Tax (GST)</h2>
      <div className={`${cardCls} ${staticTextCls}`}>
        <p>For the purposes of GST legislation, the Parties confirm that:</p>
        <ul className="list-disc pl-5">
          <li>a supply of supports under this Service Agreement is a supply of one or more of the reasonable and necessary supports specified in the client&apos;s NDIS Plan currently in effect;</li>
          <li>the client&apos;s NDIS Plan is expected to remain in effect during the period the supports are provided; and</li>
          <li>the client / client representative will immediately notify the provider if the client&apos;s NDIS Plan is replaced by a new plan or the client stops being a participant in the NDIS.</li>
        </ul>
      </div>

      {/* 11. Cancellation policy */}
      <h2 className={sectionTitleCls}>11. Cancellation Policy</h2>
      <div className={cardCls}>
        <p className="font-bold text-secondary-text">11.1 Short Notice Cancellations</p>
        <p className={staticTextCls}>
          Where Health U Australia has a Short Notice Cancellation (or no show), we can claim up to 100% of
          the agreed fee associated with the activity from the participant&apos;s plan, subject to the NDIS
          Pricing Arrangement and Price Limits and the terms of this Service Agreement.
        </p>
        <p className="font-bold text-secondary-text">Short Notice Cancellation – 7 clear business days</p>
        <ul className={`${staticTextCls} list-disc pl-5`}>
          <li>This applies where you have provided less than seven (7) clear business days&apos; notice of cancellation for a support, or if you do not show up for a scheduled support within a reasonable time.</li>
          <li>We may choose to waive the Short Notice Cancellation fee at our discretion.</li>
          <li>Claims for a short notice cancellation will be made using the same support item as would have been used if the support had been delivered.</li>
          <li>If we observe an unusual number of short notice cancellations we will discuss with you to seek to understand why they are occurring.</li>
        </ul>
        <label className={checkboxRowCls}>
          <input type="checkbox" {...register('cancellationPolicyAcknowledged', { required: true })} />
          I have read &amp; understood the cancellation policy <Req />
        </label>
      </div>

      {/* Consent for service delivery */}
      <h2 className={sectionTitleCls}>Consent for Service Delivery</h2>
      <div className={cardCls}>
        <p className="font-bold text-secondary-text">Data Collection Information</p>
        <p className={staticTextCls}>Information about your needs allows our team to:</p>
        <ul className={`${staticTextCls} list-disc pl-5`}>
          <li>decide if we can provide a service that suits your needs</li>
          <li>develop a person-centred plan and create a roster/schedule</li>
          <li>develop an individual medication plan (if applicable)</li>
          <li>share information with support staff</li>
          <li>share information with other providers or people to develop a comprehensive plan</li>
        </ul>
        <label className={checkboxRowCls}>
          <input type="checkbox" {...register('consentInfoConfidential', { required: true })} />
          I understand that all information provided by me or about me remains confidential unless I agree to disclose to others <Req />
        </label>
        <label className={checkboxRowCls}>
          <input type="checkbox" {...register('consentChangeAnytime', { required: true })} />
          I understand I can change this consent at any time by contacting my designated point of contact or the office <Req />
        </label>

        <p className="uppercase text-sm font-bold tracking-wide bg-neutral-300 text-neutral-800 rounded px-4 py-2 mt-4">
          Additional Consents
        </p>
        <YesNo name="consentMedication" control={control} label="Medication: Allow to assist with medication (refer to Management of Medication documentation, if yes)" />
        <YesNo name="consentMoneyManagement" control={control} label="Money Management: Where required and requested, support the participant to access and spend their own money as the client decides" />
        <YesNo name="consentPhotosService" control={control} label="Photos/videos for service delivery only" />
        <YesNo name="consentPhotosMedia" control={control} label="Photos/videos for media" />
        <YesNo name="consentPublishFeedback" control={control} label="Publish my feedback/quotes" />
      </div>

      {/* 12. Contact details */}
      <h2 className={sectionTitleCls}>12. Contact Details</h2>
      <div className={cardCls}>
        <p className={subTitleCls}>Participant</p>
        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Address <Req /></label>
            <input className={inputCls} {...register('contactAddress', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Phone <Req /></label>
            <input className={inputCls} {...register('contactPhone', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} {...register('contactEmail')} />
          </div>
        </div>

        <p className="text-sm text-neutral-700 mt-4">Is there an alternative contact person? <Req /></p>
        <Controller
          name="hasAlternativeContact"
          control={control}
          render={({ field }) => (
            <div className="flex gap-6">
              <label className={checkboxRowCls}>
                <input type="radio" checked={field.value === 'yes'} onChange={() => field.onChange('yes')} />
                Yes
              </label>
              <label className={checkboxRowCls}>
                <input type="radio" checked={field.value === 'no'} onChange={() => field.onChange('no')} />
                No
              </label>
            </div>
          )}
        />

        {hasAlternativeContact === 'yes' && (
          <>
            <p className="text-sm text-neutral-700 mt-2">Relationship with Participant</p>
            <div className="grid sm:grid-cols-3 gap-2">
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <label key={opt} className={checkboxRowCls}>
                  <input type="checkbox" value={opt} {...register('altRelationship')} />
                  {opt}
                </label>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>Alternative contact person <Req /></label>
                <input className={inputCls} {...register('altContactName', { required: hasAlternativeContact === 'yes' })} />
              </div>
              <div>
                <label className={labelCls}>Alternative contact person&apos;s number <Req /></label>
                <input className={inputCls} {...register('altContactNumber', { required: hasAlternativeContact === 'yes' })} />
              </div>
              <div>
                <label className={labelCls}>Alternative contact person email</label>
                <input type="email" className={inputCls} {...register('altContactEmail')} />
              </div>
            </div>
          </>
        )}

        <p className={subTitleCls}>Health U Australia can be contacted on:</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Contact Name <Req /></label>
            <input className={inputCls} {...register('orgContactName', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Phone <Req /></label>
            <input className={inputCls} {...register('orgPhone', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Email <Req /></label>
            <input type="email" className={inputCls} {...register('orgEmail', { required: true })} />
          </div>
          <div>
            <label className={labelCls}>Postal Address <Req /></label>
            <input className={inputCls} {...register('orgPostalAddress', { required: true })} />
          </div>
        </div>
      </div>

      {/* 13. Schedule of supports / quote */}
      <h2 className={sectionTitleCls}>13. Schedule of Supports</h2>
      <div className={cardCls}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className={labelCls}>Quote Number</label>
            <input className={inputCls} {...register('quoteNumber')} placeholder="Q-2026-0001" />
          </div>
          <div>
            <label className={labelCls}>Quote Date</label>
            <input type="date" className={inputCls} {...register('quoteDate')} />
          </div>
          <div>
            <label className={labelCls}>Plan Start Date</label>
            <input type="date" className={inputCls} {...register('planStartDate')} />
          </div>
          <div>
            <label className={labelCls}>Plan End Date</label>
            <input type="date" className={inputCls} {...register('planEndDate')} />
          </div>
          <div>
            <label className={labelCls}>Participant Name</label>
            <input className={`${inputCls} bg-neutral-100`} value={participantName} disabled readOnly />
          </div>
          <div>
            <label className={labelCls}>NDIS Number</label>
            <input className={`${inputCls} bg-neutral-100`} value={participantNdisNumber} disabled readOnly />
          </div>
          <div>
            <label className={labelCls}>Prepared By</label>
            <input className={inputCls} {...register('preparedBy')} />
          </div>
          <div>
            <label className={labelCls}>Contact</label>
            <input className={inputCls} {...register('contactPerson')} />
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 sm:-mx-8 mt-2">
          <table className="min-w-[1100px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#1F3864] text-white text-left">
                <th className="p-2 font-semibold">Item Code</th>
                <th className="p-2 font-semibold min-w-[220px]">Item Name</th>
                <th className="p-2 font-semibold">Unit Price</th>
                <th className="p-2 font-semibold">Frequency</th>
                <th className="p-2 font-semibold">Day</th>
                <th className="p-2 font-semibold">Hours/Service</th>
                <th className="p-2 font-semibold">Qty/Period</th>
                <th className="p-2 font-semibold">Start Date</th>
                <th className="p-2 font-semibold">End Date</th>
                <th className="p-2 font-semibold">Weeks</th>
                <th className="p-2 font-semibold">Line Total</th>
                <th className="p-2 font-semibold min-w-[160px]">Notes</th>
                <th className="p-2 print:hidden"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="odd:bg-blue-50/40 border-b border-neutral-200">
                  <td className="p-1.5"><input className={smallInputCls} {...register(`items.${index}.itemCode` as const)} /></td>
                  <td className="p-1.5"><input className={smallInputCls} {...register(`items.${index}.itemName` as const)} /></td>
                  <td className="p-1.5"><input type="number" step="0.01" min="0" className={smallInputCls} {...register(`items.${index}.unitPrice` as const)} /></td>
                  <td className="p-1.5">
                    <select className={smallInputCls} {...register(`items.${index}.frequency` as const)}>
                      {FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </td>
                  <td className="p-1.5">
                    <select className={smallInputCls} {...register(`items.${index}.dayOfWeek` as const)}>
                      {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td className="p-1.5"><input type="number" step="0.5" min="0" className={smallInputCls} {...register(`items.${index}.hoursPerService` as const)} /></td>
                  <td className="p-1.5"><input type="number" step="1" min="0" className={smallInputCls} {...register(`items.${index}.qtyPerPeriod` as const)} /></td>
                  <td className="p-1.5"><input type="date" className={smallInputCls} {...register(`items.${index}.startDate` as const)} /></td>
                  <td className="p-1.5"><input type="date" className={smallInputCls} {...register(`items.${index}.endDate` as const)} /></td>
                  <td className="p-1.5 text-center whitespace-nowrap">{computedRows[index]?.weeks ?? 0}</td>
                  <td className="p-1.5 text-right whitespace-nowrap font-semibold">{money(computedRows[index]?.lineTotal ?? 0)}</td>
                  <td className="p-1.5"><input className={smallInputCls} {...register(`items.${index}.notes` as const)} /></td>
                  <td className="p-1.5 print:hidden">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-primary text-xs font-semibold disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={() => append({ ...emptyItem })}
          className="print:hidden self-start text-sm font-semibold text-white bg-secondary hover:bg-primary transition-colors duration-300 rounded-full px-5 py-2 w-fit"
        >
          + Add support item
        </button>

        <div className="flex flex-col items-end gap-1 border-t border-neutral-200 pt-4 mt-2">
          <label className="flex items-center gap-2 text-sm text-neutral-700 mb-2">
            <input type="checkbox" {...register('applyGst')} />
            Apply GST (10%)
          </label>
          <p className="text-sm text-neutral-600">Subtotal: <span className="font-semibold">{money(subtotal)}</span></p>
          <p className="text-sm text-neutral-600">GST: <span className="font-semibold">{money(gstAmount)}</span></p>
          <p className="text-lg font-bold text-secondary-text">Grand Total: <span className="text-primary">{money(grandTotal)}</span></p>
        </div>
      </div>

      {/* 14. Signatures */}
      <h2 className={sectionTitleCls}>14. Agreement Signatures</h2>
      <div className={cardCls}>
        <p className={staticTextCls}>The parties understand and agree to the terms and conditions of this Service Agreement.</p>
        <label className={checkboxRowCls}>
          <input type="checkbox" {...register('agreementExplained', { required: true })} />
          This Service Agreement has been explained to me using a language, mode or method that I understand <Req />
        </label>

        <div className="grid sm:grid-cols-2 gap-8 mt-4">
          <div className="flex flex-col gap-4">
            <Controller
              name="participantSignature"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SignaturePad label="Signature of Participant / Participant Representative *" value={field.value} onChange={field.onChange} />
              )}
            />
            <div>
              <label className={labelCls}>Name of Participant / Participant Representative <Req /></label>
              <input className={inputCls} {...register('participantSignatureName', { required: true })} />
            </div>
            <div>
              <label className={labelCls}>Signed Date <Req /></label>
              <input type="date" className={inputCls} {...register('participantSignedDate', { required: true })} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Controller
              name="providerSignature"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <SignaturePad label="Signature of Provider's Authorised Person *" value={field.value} onChange={field.onChange} />
              )}
            />
            <div>
              <label className={labelCls}>Name of Provider&apos;s Authorised Person <Req /></label>
              <input className={inputCls} {...register('providerSignatureName', { required: true })} />
            </div>
            <div>
              <label className={labelCls}>Signed Date <Req /></label>
              <input type="date" className={inputCls} {...register('providerSignedDate', { required: true })} />
            </div>
          </div>
        </div>
      </div>

      <div className="print:hidden flex justify-end mt-10">
        <button
          type="submit"
          className="text-white cursor-pointer text-lg font-semibold px-8 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300"
        >
          Download PDF
        </button>
      </div>
    </form>
  )
}

export default ServiceAgreementForm
