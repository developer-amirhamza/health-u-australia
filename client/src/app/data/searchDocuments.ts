import {
  about, choose_items, service_items, ndis_items, community_participation,
  capacity_building, support_coordination, assist_in_self_care, assist_in_transport,
  home_modification, gardening_house_yard, sil_house, sil_house_details,
  belmore_slides, bowden_slides, normanhurst_slides, granny_flat,
  career_jobs, career_infographic, contact_details,
} from 'config/page';
import { faqEntries } from './faq';
import { searchableText, type SearchDocument } from 'utils/siteSearch';

// Public destinations only. Add new public pages here; content-backed pages use
// the same arrays as their views, so copy changes are searchable automatically.
const pages: (SearchDocument & { source?: unknown })[] = [
  { title: 'Health U Australia', href: '/', category: 'About', description: 'Disability support services, personalised care and community participation in NSW.', source: [service_items, choose_items], keywords: 'home health u support services' },
  { title: 'About Health U', href: '/about', category: 'About', description: 'Learn about Health U Australia and our person-centred approach to disability support.', source: about },
  { title: 'NDIS', href: '/ndis', category: 'NDIS', description: 'National Disability Insurance Scheme information, eligibility and application support.', source: ndis_items },
  { title: 'Community Participation', href: '/community-participation', category: 'Services', description: 'Social activities, community access, groups, outings and participation support.', source: community_participation },
  { title: 'Capacity Building', href: '/capacity-building', category: 'Services', description: 'Build daily living skills, confidence and independence.', source: capacity_building },
  { title: 'Support Coordination', href: '/support-coordination', category: 'Services', description: 'Help understanding your NDIS plan and connecting with suitable support providers.', source: support_coordination },
  { title: 'Assist in Self-care', href: '/assist-in-self-care', category: 'Services', description: 'Personal care and assistance with everyday tasks, bathing, dressing and routines.', source: assist_in_self_care },
  { title: 'Assist in Transport', href: '/assist-in-transport', category: 'Services', description: 'Accessible transport for appointments, activities and community access.', source: assist_in_transport },
  { title: 'Home Modification', href: '/home-modification', category: 'Services', description: 'Home modifications to improve safety, accessibility and independent living.', source: home_modification },
  { title: 'Gardening, House and Yard Maintenance', href: '/gardening-house-yard', category: 'Services', description: 'Help keeping your home, garden and outdoor areas safe and maintained.', source: gardening_house_yard },
  { title: 'Compassion in Action – Non NDIS Support', href: '/compassion-in-action', category: 'Services', description: 'Short-term, affordable support for people outside government-funded services.', content: 'The Compassion in Action CIA program provides domestic support, light cleaning, transport, personal care, showering, dressing, meal preparation and social support. Practical assistance while regaining stability, including people not connected with NDIS, My Aged Care, Carer Gateway or ComPacks.', keywords: 'non ndis privately funded companionship' },
  { title: 'SIL House Properties', href: '/sil-house', category: 'SIL House', description: 'Explore supported independent living homes, property features and application criteria.', source: [sil_house, sil_house_details], keywords: 'accommodation housing respite short term STA MTA' },
  { title: 'Belmore Street Ryde NSW 2112', href: '/belmore_street/', category: 'SIL House', description: 'Explore the Belmore Street SIL property in Ryde, its features and gallery.', source: belmore_slides, keywords: 'SIL housing accommodation' },
  { title: 'Bowden Street Ryde NSW 2112', href: '/bowden_street/', category: 'SIL House', description: 'Explore the Bowden Street SIL property in Ryde, its features and gallery.', source: bowden_slides, keywords: 'SIL housing accommodation' },
  { title: 'Denman Parade Normanhurst NSW 2076', href: '/normanhurst/', category: 'SIL House', description: 'Explore the Normanhurst SIL property, its features and gallery.', source: normanhurst_slides, keywords: 'SIL housing accommodation' },
  { title: 'Belmore Street Granny Flat', href: '/granny-flat/', category: 'SIL House', description: 'Explore the Belmore Street granny flat in Ryde, its features and gallery.', source: granny_flat, keywords: 'SIL housing accommodation' },
  { title: 'Current Events – Cooking Class', href: '/current-events', category: 'Events', description: 'Health U Australia cooking classes: every Wednesday, 1:00 pm–3:00 pm, at SIL Bowden Street Ryde NSW 2112.', content: 'Healthy eating starts with confidence in the kitchen. Join our cooking class to learn simple, nutritious recipes that bring joy back to mealtimes. Cook, connect, and discover how good food can make you feel.', keywords: 'events news workshops cooking gallery' },
  { title: 'Past Events – Bunny & Turtle Walk', href: '/past-events', category: 'Events', description: 'A relaxed networking walk along the Parramatta River, connecting the disability and community services sector.', content: 'Join Get Picked Up, MyLife Housing and Health U Support Services. Starting from Meadowbank, enjoy the outdoors, connection, conversation and wellbeing.', keywords: 'past events news' },
  { title: 'Gallery', href: '/gallery', category: 'Gallery', description: 'View photos from Health U Australia properties, activities and community events.' },
  { title: 'Careers', href: '/career', category: 'Careers', description: 'Explore jobs and career opportunities with Health U Australia.', source: [career_jobs, career_infographic], keywords: 'employment vacancies work applications' },
  ...career_jobs.map(job => ({ title: job.title, href: `/career/${job.id}`, category: 'Careers', description: `${job.title}. View the role and apply.`, source: job, keywords: 'job employment vacancy recruitment' })),
  { title: 'Career Application Form', href: '/career-form', category: 'Careers', description: 'Apply to join the Health U Australia team.', keywords: 'resume cv job employment application' },
  { title: 'Contact Us', href: '/contact-us', category: 'Contact', description: 'Get in touch with Health U Australia by phone or email, or find our office locations.', source: contact_details, keywords: 'enquiry enquire telephone address opening hours' },
  { title: 'Referral', href: '/referral', category: 'Contact', description: 'Refer a participant to Health U Australia for disability support services.', keywords: 'refer referral form participant provider support' },
  { title: 'Participant Feedback and Complaints', href: '/participant-feedback', category: 'Contact', description: 'Share feedback, submit a complaint and learn about your rights and the complaints process.', content: 'Talk to us first. Submit a formal complaint. We investigate and provide a resolution and follow-up. Contact the NDIS Quality and Safeguards Commission on 1800 035 544 or seek independent advocacy through the National Disability Advocacy Program.', keywords: 'feedback complaint concerns rights advocate advocacy' },
  { title: 'Sign In', href: '/signin', category: 'Account', description: 'Sign in to your Health U Australia account.', keywords: 'login log in account password' },
  { title: 'Sign Up', href: '/signup', category: 'Account', description: 'Create your Health U Australia account.', keywords: 'register registration sign up account' },
];

export const publicSearchDocuments: SearchDocument[] = pages.map(({ source, ...page }) => {
  const matchingFaqs = faqEntries.filter(entry => (entry.link?.href.replace(/\/+$/, '') || '') === page.href.replace(/\/+$/, ''));
  return {
    ...page,
    content: [page.content, searchableText(source), ...matchingFaqs.map(entry => `${entry.question} ${entry.answer}`)].filter(Boolean).join(' '),
    keywords: [page.keywords, ...matchingFaqs.flatMap(entry => entry.keywords)].filter(Boolean).join(' '),
  };
});
