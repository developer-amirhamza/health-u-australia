// One-off seed for the /training page's initial content.
//
// Run once, against the real database, after `prisma db push` has applied
// the TrainingResource model:
//   npx tsx scripts/seed-training-resources.ts
//
// Safe to re-run: it does nothing if any TrainingResource rows already
// exist, so it won't duplicate content the admin panel has since edited.
import { prisma } from '../src/lib/prisma.js';

const RESOURCES: { category: string; title: string; description: string; link: string }[] = [
  // Required NDIS Training
  {
    category: 'REQUIRED_TRAINING',
    title: 'NDIS Worker Orientation Module – Quality, Safety and You',
    description: 'A free module introducing new and existing NDIS workers to the NDIS Code of Conduct and how to deliver safe, quality supports.',
    link: 'https://www.ndiscommission.gov.au/trainingcourse',
  },
  {
    category: 'REQUIRED_TRAINING',
    title: 'New Worker – NDIS Induction Modules',
    description: 'Induction training covering what new workers need to know before supporting NDIS participants, including rights, responsibilities and reporting obligations.',
    link: 'https://www.ndiscommission.gov.au/online-training-modules',
  },
  {
    category: 'REQUIRED_TRAINING',
    title: 'Supporting Effective Communication',
    description: 'Guidance on communicating respectfully and effectively with NDIS participants, including those with complex communication needs.',
    link: 'https://www.ndiscommission.gov.au/online-training-modules',
  },
  {
    category: 'REQUIRED_TRAINING',
    title: 'Supporting Safe and Enjoyable Meals',
    description: 'Training on supporting participants to eat and drink safely, including recognising and managing swallowing risks.',
    link: 'https://www.ndiscommission.gov.au/online-training-modules',
  },

  // Important NDIS Commission Resources
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Code of Conduct',
    description: 'The standards of conduct all NDIS workers and providers must follow to ensure safe, respectful and ethical support.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Practice Standards',
    description: 'The quality standards registered NDIS providers must meet across governance, support provision and the service environment.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'Rights of People with Disability',
    description: 'An overview of the rights of NDIS participants, including dignity, choice, control and freedom from harm.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/rights-people-disability',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'Incident Management and Reportable Incidents',
    description: 'Requirements for identifying, managing and reporting incidents that occur during the delivery of NDIS supports.',
    link: 'https://www.ndiscommission.gov.au/providers/incident-management-and-reportable-incidents',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'Behaviour Support and Restrictive Practices',
    description: 'Guidance on behaviour support and the rules around using restrictive practices with NDIS participants.',
    link: 'https://www.ndiscommission.gov.au/providers/behaviour-support',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'Positive Behaviour Support',
    description: 'Information on person-centred, evidence-based approaches to supporting participants with behaviours of concern.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/behaviour-support-and-restrictive-practices/positive-behaviour-support',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Workforce Capability Framework',
    description: 'The skills, knowledge and behaviours expected of everyone who works in the NDIS.',
    link: 'https://www.ndiscommission.gov.au/workforce/workforce-capability-framework',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Worker Screening',
    description: 'The worker screening check required before working in certain roles with NDIS participants.',
    link: 'https://www.ndiscommission.gov.au/workforce/worker-screening',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Complaints and Feedback',
    description: 'How participants, families and workers can raise a complaint or feedback with the NDIS Commission.',
    link: 'https://www.ndiscommission.gov.au/complaints/report',
  },
  {
    category: 'COMMISSION_RESOURCE',
    title: 'NDIS Provider and Participant Packs',
    description: 'Resource packs explaining provider and participant obligations, rights and responsibilities under the NDIS.',
    link: 'https://www.ndiscommission.gov.au/provider-and-participant-packs',
  },

  // NDIS Knowledge and Responsibilities
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Participant Rights, Choice and Control',
    description: "Understanding a participant's right to make their own choices and remain in control of their supports.",
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/rights-people-disability',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Privacy, Confidentiality and Professional Conduct',
    description: 'Expectations around protecting participant privacy and maintaining professional boundaries.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Dignity of Risk and Supported Decision-Making',
    description: "Balancing a participant's right to take everyday risks with the support needed to make informed decisions.",
    link: 'https://www.ndiscommission.gov.au/workforce/supervision-and-effective-communication/working-together-guide-ndis-participants',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Person-Centred and Safe Support',
    description: 'Delivering support that is tailored to the individual while keeping them safe.',
    link: 'https://www.ndiscommission.gov.au/workforce/workforce-capability-framework',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Duty of Care, Risk Management and Safeguarding',
    description: "Worker obligations to act in a participant's best interests and manage foreseeable risks.",
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Abuse, Neglect, Violence, Exploitation and Sexual Misconduct',
    description: 'Recognising and preventing abuse, neglect, violence, exploitation and sexual misconduct.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Incident Management and Reportable Incidents',
    description: 'Requirements for identifying, managing and reporting incidents that occur during the delivery of NDIS supports.',
    link: 'https://www.ndiscommission.gov.au/providers/incident-management-and-reportable-incidents',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Positive Behaviour Support, Behaviour Support Plans and Restrictive Practices',
    description: 'Person-centred approaches to behaviour support and the rules around using restrictive practices.',
    link: 'https://www.ndiscommission.gov.au/providers/behaviour-support',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Behaviours of Concern, ABC Recording and De-escalation',
    description: 'Recognising, recording (Antecedent-Behaviour-Consequence) and safely responding to behaviours of concern.',
    link: 'https://www.ndiscommission.gov.au/online-training-modules',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Respectful and Effective Communication',
    description: 'Communicating respectfully and effectively with participants, including those with complex communication needs.',
    link: 'https://www.ndiscommission.gov.au/online-training-modules',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Complaints and Feedback',
    description: "How to raise, and respond to, complaints and feedback under the NDIS Commission's complaints process.",
    link: 'https://www.ndiscommission.gov.au/complaints/report',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Objective Documentation and Progress Notes',
    description: 'Writing clear, factual and objective notes that accurately reflect the support provided.',
    link: 'https://www.ndiscommission.gov.au/workforce/workforce-capability-framework',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'Participant Information, Social Media and Photography',
    description: 'Appropriate handling of participant information, images and social media use.',
    link: 'https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct',
  },
  {
    category: 'KNOWLEDGE_RESPONSIBILITY',
    title: 'NDIS Worker Screening Requirements',
    description: 'The worker screening check required before working in certain roles with NDIS participants.',
    link: 'https://www.ndiscommission.gov.au/workforce/worker-screening',
  },
];

async function main() {
  const existingCount = await prisma.trainingResource.count();
  if (existingCount > 0) {
    console.log(`TrainingResource already has ${existingCount} row(s) — skipping seed.`);
    return;
  }

  const byCategory = new Map<string, number>();
  const rows = RESOURCES.map((r) => {
    const order = byCategory.get(r.category) ?? 0;
    byCategory.set(r.category, order + 1);
    return { ...r, order };
  });

  await prisma.trainingResource.createMany({ data: rows });
  console.log(`Seeded ${rows.length} training resources.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
