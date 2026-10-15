"use client"
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import PageBanner from 'utils/PageBanner'
import HandbookMarkdown from 'utils/HandbookMarkdown'
import { FaMagnifyingGlass, FaPrint, FaArrowUp, FaChevronDown } from 'react-icons/fa6'
import { SummeryApi } from 'app/common/SummeryApi'
import Axios from 'utils/Axios'

interface HandbookSection {
    id: string;
    part: string;
    title: string;
    content: string;
    updatedAt: string;
}

interface HandbookPart {
    name: string;
    sections: HandbookSection[];
}

// Sections arrive sorted by `order`; parts keep the order of their first section.
const groupByPart = (sections: HandbookSection[]): HandbookPart[] => {
    const parts: HandbookPart[] = [];
    for (const section of sections) {
        let part = parts.find(p => p.name === section.part);
        if (!part) {
            part = { name: section.part, sections: [] };
            parts.push(part);
        }
        part.sections.push(section);
    }
    return parts;
}

const anchorFor = (section: HandbookSection) => `handbook-${section.id}`;

const ParticipantHandbook = () => {
    const [sections, setSections] = useState<HandbookSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [query, setQuery] = useState('');
    const [tocOpen, setTocOpen] = useState(false);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await Axios({ ...SummeryApi.getPublicHandbookSections });
                if (response.data?.success) setSections(response.data.data || []);
                else setFailed(true);
            } catch (error) {
                console.error(error);
                setFailed(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const allParts = useMemo(() => groupByPart(sections), [sections]);

    const visibleParts = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allParts;
        return groupByPart(sections.filter(s =>
            s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q) || s.part.toLowerCase().includes(q)
        ));
    }, [allParts, sections, query]);

    const lastUpdated = useMemo(() => {
        const times = sections.map(s => new Date(s.updatedAt).getTime()).filter(Number.isFinite);
        if (times.length === 0) return null;
        return new Date(Math.max(...times)).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
    }, [sections]);

    const visibleCount = visibleParts.reduce((n, p) => n + p.sections.length, 0);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="w-full print:hidden">
                <PageBanner title="Participant Handbook" path="/participant-handbook" />
            </div>

            <div className="container max-md:px-5 flex flex-col items-center mx-auto w-full gap-12 py-12">

                {/* Intro */}
                <div className="flex flex-col gap-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-secondary">Your Guide to Working with Health U Australia</h2>
                    <div className="w-14 h-0.75 bg-primary mx-auto" />
                    <p className="text-lg text-secondary-text font-medium">
                        This handbook explains the disability services and supports we provide, your rights and
                        responsibilities, and how we partner with you to meet your support needs. Browse the contents,
                        search for a topic, or print a copy to keep.
                    </p>
                    {lastUpdated && <p className="text-sm text-secondary-text/80">Last updated {lastUpdated}</p>}
                </div>

                {loading ? (
                    <div className="py-12 text-secondary-text">Loading the participant handbook...</div>
                ) : failed ? (
                    <div className="py-12 text-secondary-text text-center">
                        The handbook couldn&apos;t be loaded right now. Please try again later or <Link href="/contact-us" className="text-primary underline">contact us</Link> for a copy.
                    </div>
                ) : allParts.length === 0 ? (
                    <div className="py-12 text-secondary-text">The participant handbook will be available here soon.</div>
                ) : (
                    <div className="grid w-full gap-10 lg:grid-cols-[280px_minmax(0,1fr)] items-start">

                        {/* Contents */}
                        <aside className="flex flex-col gap-4 lg:sticky lg:top-44 lg:max-h-[calc(100vh-12rem)] print:hidden">
                            <div className="relative">
                                <FaMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Search the handbook"
                                    aria-label="Search the handbook"
                                    className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                                />
                            </div>
                            <div className="rounded-xl border bg-white shadow-sm lg:min-h-0 lg:overflow-y-auto">
                                {/* Collapsed by default on small screens so the handbook itself stays near the top. */}
                                <button
                                    onClick={() => setTocOpen(open => !open)}
                                    aria-expanded={tocOpen}
                                    className="lg:hidden w-full flex items-center justify-between px-5 py-3 font-semibold text-secondary-text"
                                >
                                    Contents <FaChevronDown size={12} className={`transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <span className="hidden lg:block px-5 py-3 font-semibold text-secondary-text">Contents</span>
                                <nav className={`${tocOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-4 px-5 pb-5`}>
                                    {visibleParts.map(part => (
                                        <div key={part.name} className="flex flex-col gap-1.5">
                                            <span className="text-xs font-bold uppercase tracking-wide text-primary">{part.name}</span>
                                            {part.sections.map(section => (
                                                <a key={section.id} href={`#${anchorFor(section)}`} onClick={() => setTocOpen(false)}
                                                    className="text-sm text-secondary-text hover:text-primary transition-colors duration-200 leading-snug">
                                                    {section.title}
                                                </a>
                                            ))}
                                        </div>
                                    ))}
                                    {visibleCount === 0 && <span className="text-sm text-secondary-text">No topics match your search.</span>}
                                </nav>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-primary hover:bg-secondary transition-colors duration-300 rounded-full px-5 py-2.5"
                            >
                                <FaPrint size={14} /> Print or save as PDF
                            </button>
                        </aside>

                        {/* Handbook body */}
                        <div className="flex flex-col gap-14 min-w-0">
                            {query && (
                                <p className="text-sm text-secondary-text print:hidden">
                                    {visibleCount} topic{visibleCount !== 1 ? 's' : ''} matching &ldquo;{query}&rdquo; ·{' '}
                                    <button onClick={() => setQuery('')} className="text-primary underline">Clear search</button>
                                </p>
                            )}
                            {visibleParts.map(part => (
                                <section key={part.name} className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <h2 className="text-3xl font-bold text-secondary">{part.name}</h2>
                                        <div className="w-14 h-0.75 bg-primary" />
                                    </div>
                                    {part.sections.map(section => (
                                        <article
                                            key={section.id}
                                            id={anchorFor(section)}
                                            className="scroll-mt-44 flex flex-col gap-4 bg-white p-6 md:p-8 rounded-xl shadow-sm border"
                                        >
                                            <h3 className="text-2xl font-semibold text-gray-800">{section.title}</h3>
                                            <HandbookMarkdown content={section.content} />
                                        </article>
                                    ))}
                                </section>
                            ))}
                            <a href="#top" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                                className="self-end flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary print:hidden">
                                <FaArrowUp size={12} /> Back to top
                            </a>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10 rounded-2xl print:hidden">
                    <h2 className="text-3xl font-bold text-center">Questions About Your Supports?</h2>
                    <div className="w-14 h-0.75 bg-primary items-center" />
                    <p className="flex text-lg text-secondary-text font-medium text-center">
                        Our Support Service Manager is happy to talk you through anything in this handbook.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href={"/contact-us"} className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300">Contact Us</Link>
                        <Link href={"/participant-feedback"} className="text-primary text-lg font-semibold px-9 py-3.5 rounded-full border-2 border-primary hover:bg-primary hover:text-white transition-colors duration-300">Give Feedback</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ParticipantHandbook
