import { prisma } from '../src/lib/prisma.js';
import { ndisContent } from '../src/pages/ndis/content.js';
import { compassionContent } from '../src/pages/compassion/content.js';
import { feedbackContent } from '../src/pages/feedback/content.js';

const pages = [
  ['ndis', ndisContent],
  ['compassion-in-action', compassionContent],
  ['participant-feedback', feedbackContent],
] as const;

try {
  for (const [slug, content] of pages) {
    await prisma.managedPage.createMany({ data: [{ slug, content }], skipDuplicates: true });
    console.log(`Seeded ${slug} if absent`);
  }
} finally {
  await prisma.$disconnect();
}
