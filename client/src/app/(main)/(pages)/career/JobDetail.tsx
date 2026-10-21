"use client"
import Link from 'next/link'
import { useManagedPage } from 'app/(main)/(pages)/_managed/useManagedPage'
import { career_jobs } from 'config/page'

type Job = typeof career_jobs[number] & { pay: string; description: string; requirements: string[]; responsibilities: string[]; benefits: string[]; job_type: string; location: string }
export default function JobDetail({ id }: { id: string }) {
  const { data } = useManagedPage<{ jobs: Job[] }>('career')
  const job = data?.jobs.find(item => item.id === id)
  if (!data) return <main className="bg-amber-100 min-h-80 p-10 text-center">Loading job details...</main>
  if (!job) return <main className="bg-amber-100 min-h-80 p-10 text-center"><h1 className="text-2xl font-bold">Job not found</h1><Link href="/career" className="underline">Back to careers</Link></main>
  return <main className="bg-amber-100 min-h-screen py-10 px-5"><article className="container mx-auto max-w-5xl grid gap-5 text-secondary-text">
    <h1 className="text-3xl font-bold text-center uppercase">{job.title}</h1><p className="font-semibold text-center">{job.publish_date}</p>
    <div className="bg-amber-50 rounded p-6 md:p-10 grid gap-5"><h2 className="text-xl font-semibold">{job.title}</h2><p><strong>Pay:</strong> {job.pay}</p>
      <h3 className="font-semibold text-lg">Job description:</h3><p className="whitespace-pre-line">{job.description}</p>
      {([['Qualifications & experience', job.requirements], ['Tasks & responsibilities', job.responsibilities], ['Benefits', job.benefits]] as const).map(([heading, items]) => <section key={heading}><h3 className="font-semibold text-lg mb-3">{heading}</h3><ul className="list-disc pl-8 grid gap-2">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></section>)}
      <p><strong>Job Type:</strong> {job.job_type}</p><p><strong>Work Location:</strong> {job.location}</p>
      <Link href="https://healthuaustralia.snapforms.com.au/form/career-request-to-health-u-australia" className="bg-white text-primary font-semibold px-6 py-3 border-2 border-white hover:border-primary max-w-max mx-auto rounded-full shadow">Apply Now</Link>
    </div></article></main>
}
