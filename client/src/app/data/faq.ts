export interface FaqEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  link?: { href: string; label: string };
}

export const faqEntries: FaqEntry[] = [
  {
    id: "what-is-health-u",
    question: "What is Health U Support Services?",
    keywords: ["what is health u", "who are you", "about health u", "about the company", "who is this"],
    answer:
      "Health U Support Services is an NDIS support provider based in Ryde, NSW. We offer community participation, assistance with self-care, transport assistance, domestic assistance, capacity building, support coordination, and home/yard maintenance, with a person-centred approach to each participant.",
    link: { href: "/about", label: "About Health U" },
  },
  {
    id: "what-is-ndis",
    question: "What is the NDIS?",
    keywords: ["what is ndis", "ndis mean", "national disability insurance scheme"],
    answer:
      "The NDIS (National Disability Insurance Scheme) is an Australian government initiative that provides funding and support to Australians with permanent disabilities, giving access to services like community participation and transport support.",
    link: { href: "/ndis", label: "Learn more about NDIS" },
  },
  {
    id: "ndis-eligibility",
    question: "Am I eligible for the NDIS?",
    keywords: ["eligible for ndis", "ndis eligibility", "qualify for ndis", "who can get ndis", "can i get ndis"],
    answer:
      "Broadly, the NDIS is aimed at Australians with a significant, permanent disability that affects daily life. Exact eligibility rules (age, residency status, disability requirements) are set by the NDIS itself and can be nuanced, so the most reliable way to check is a free consultation with our team — we help assess eligibility and handle the application for you at no cost.",
    link: { href: "/ndis", label: "NDIS eligibility & application support" },
  },
  {
    id: "ndis-application-help",
    question: "Can you help me apply for the NDIS?",
    keywords: ["apply for ndis", "ndis application", "help me apply", "how to apply for ndis"],
    answer:
      "Yes — we offer free NDIS application support, including an initial consultation, help completing and submitting the application, preparing supporting documents/reports, and liaising with NDIS on your behalf.",
    link: { href: "/ndis", label: "NDIS application support" },
  },
  {
    id: "services-overview",
    question: "What services do you offer?",
    keywords: ["what services", "what do you offer", "your services", "list of services"],
    answer:
      "We offer Community Participation, Capacity Building, Support Coordination, Assistance in Self-Care, Assistance in Transport, Home Modification, Gardening/House & Yard Maintenance, Supported Independent Living (SIL), and non-NDIS support through our Compassion in Action program.",
  },
  {
    id: "community-participation",
    question: "What is Community Participation?",
    keywords: ["community participation", "social activities", "socialising support"],
    answer:
      "Community Participation support helps you take part in community life beyond just socialising — including personal development courses, joining social groups or clubs, camps and holidays, movies and concerts, library visits, and sporting clubs.",
    link: { href: "/community-participation", label: "Community Participation" },
  },
  {
    id: "capacity-building",
    question: "What is Capacity Building?",
    keywords: ["capacity building", "life skills support", "learn skills"],
    answer:
      "Capacity Building is skill-development support aimed at long-term independence — including learning to cook, dress, manage a daily routine, personal safety awareness, bathing, social/communication skills, and support finding employment.",
    link: { href: "/capacity-building", label: "Capacity Building" },
  },
  {
    id: "support-coordination",
    question: "What is Support Coordination?",
    keywords: ["support coordination", "ndis coordinator", "plan management"],
    answer:
      "Support Coordination helps you navigate the NDIS process efficiently. It covers three areas: Plan Implementation (understanding and implementing your NDIS plan), Service Coordination (connecting you with providers), and Monitoring & Reviewing (regular reviews of your plan and services).",
    link: { href: "/support-coordination", label: "Support Coordination" },
  },
  {
    id: "assist-self-care",
    question: "What does Assistance in Self-Care include?",
    keywords: ["self care", "personal care", "bathing", "dressing", "medication assistance"],
    answer:
      "Assistance in Self-Care covers personal care in your own home or a shared facility: bathing and showering, dressing and grooming, mobility and transferring, toileting support, oral care, medication assistance, skin care, feeding support, and assistive technology.",
    link: { href: "/assist-in-self-care", label: "Assist in Self-Care" },
  },
  {
    id: "assist-transport",
    question: "Do you provide transport support?",
    keywords: ["transport", "wheelchair vehicle", "ride to appointment", "medical appointment transport"],
    answer:
      "Yes — we provide wheelchair-accessible vehicle transport for medical appointments, community activities, social engagements, and daily living needs like grocery shopping, with modern ramps, secure tie-downs, and safety restraints. A support worker can travel along if needed.",
    link: { href: "/assist-in-transport", label: "Assist in Transport" },
  },
  {
    id: "home-modification",
    question: "Do you do home modifications?",
    keywords: ["home modification", "modify my home", "accessibility modification"],
    answer:
      "Yes — we can install equipment or modify a building's structure, fixtures, or fittings (internally or externally) to help you live independently and safely at home, including changes required due to disability-related needs or NDIS-funded assistive technology.",
    link: { href: "/home-modification", label: "Home Modification" },
  },
  {
    id: "gardening-yard",
    question: "Do you help with gardening or yard maintenance?",
    keywords: ["gardening", "yard maintenance", "lawn mowing", "house maintenance"],
    answer:
      "Yes — our team can trim grasses, remove debris, treat weeds and pests, fertilise plants, and generally maintain your home and yard for health, safety and wellbeing. This service does not include structural modifications (that falls under Home Modification instead).",
    link: { href: "/gardening-house-yard", label: "Gardening / House & Yard" },
  },
  {
    id: "what-is-sil",
    question: "What is SIL (Supported Independent Living)?",
    keywords: ["what is sil", "supported independent living", "sil house"],
    answer:
      "SIL (Supported Independent Living) is an NDIS-funded support program that helps you live independently, develop social skills, and participate in your community, either in your own home or a shared living space. Support can range from a few hours a day up to 24/7, based on your needs.",
    link: { href: "/sil-house", label: "SIL House" },
  },
  {
    id: "sil-properties",
    question: "What SIL houses/properties do you have available?",
    keywords: ["sil properties", "sil houses available", "supported living properties", "granny flat"],
    answer:
      "We currently have SIL accommodation at Belmore Street (Ryde), Bowden Street (Ryde), Normanhurst, and a Granny Flat option on Belmore Street — with a mix of permanent, medium-term, and short-term/respite stays, and trial stays available.",
    link: { href: "/sil-house", label: "View SIL properties" },
  },
  {
    id: "non-ndis-support",
    question: "Do you help people who aren't NDIS participants?",
    keywords: ["non ndis", "not eligible for ndis", "compassion in action", "no ndis funding"],
    answer:
      "Yes — our Compassion in Action (CIA) program offers short-term, affordable support (domestic help, transport, personal care, meal prep, and social support) for people who need practical help but aren't eligible for or connected with government-funded programs like NDIS, My Aged Care, or Carer Gateway. It's privately funded and offered as a paid service for a small fee, intended as stop-gap support rather than ongoing care.",
    link: { href: "/compassion-in-action", label: "Compassion in Action" },
  },
  {
    id: "referral",
    question: "How do I make a referral?",
    keywords: ["referral", "refer someone", "refer a participant"],
    answer:
      "You can submit a referral directly through our Referral page, and our team will follow up with the next steps.",
    link: { href: "/referral", label: "Make a referral" },
  },
  {
    id: "contact-details",
    question: "How do I contact you?",
    keywords: ["contact", "phone number", "email", "address", "call you", "reach you"],
    answer:
      "You can call us on 0481 707 758 / 0431 377 132 or email info@healthuau.com. Our main office is at Top Ryde City Shopping Centre, Shop MM20, Level 2, 109-129 Blaxland Road, Ryde NSW 2112 — we also have offices at Bowden Street, Ryde and Denman Parade, Normanhurst.",
    link: { href: "/contact-us", label: "Contact Us" },
  },
  {
    id: "business-hours",
    question: "What are your business hours?",
    keywords: ["business hours", "opening hours", "what time do you open", "when are you open"],
    answer:
      "Our offices operate 8:00am – 6:00pm. For exact days of the week, it's best to call ahead on 0481 707 758 / 0431 377 132.",
  },
  {
    id: "feedback-complaint",
    question: "How do I give feedback or make a complaint?",
    keywords: ["feedback", "complaint", "complain", "raise an issue"],
    answer:
      "We welcome compliments, complaints, suggestions, and general feedback. You can talk to your support worker or coordinator directly, or submit a formal complaint through our feedback form — we acknowledge receipt within 2 business days and aim to resolve it within 30 days. Making a complaint never affects the supports you receive.",
    link: { href: "/participant-feedback", label: "Participant Feedback" },
  },
  {
    id: "complaint-escalation",
    question: "What if I'm not happy with how my complaint was handled?",
    keywords: ["escalate complaint", "ndis commission", "not happy with response", "unresolved complaint"],
    answer:
      "You can escalate to the NDIS Quality and Safeguards Commission at any time, even without raising it with us first — call 1800 035 544 or visit ndiscommission.gov.au. Free, independent advocacy is also available through the National Disability Advocacy Program (dss.gov.au).",
    link: { href: "/participant-feedback", label: "Participant Feedback" },
  },
  {
    id: "careers",
    question: "Are you hiring? How do I apply for a job?",
    keywords: ["job", "hiring", "career", "vacancy", "apply for job", "work with you"],
    answer:
      "We're often looking for compassionate, reliable support workers and staff. Check our Careers page for current openings and apply through the linked application form.",
    link: { href: "/career", label: "Careers" },
  },
  {
    id: "locations",
    question: "What areas/locations do you serve?",
    keywords: ["locations", "areas you serve", "which suburbs", "service area"],
    answer:
      "We're based in Ryde, NSW, with offices at Top Ryde, Bowden Street (Ryde), and Normanhurst, primarily serving the Ryde, Hornsby, and Northern Districts areas.",
    link: { href: "/contact-us", label: "Contact Us" },
  },
];
