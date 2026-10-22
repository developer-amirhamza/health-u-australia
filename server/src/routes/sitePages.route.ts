import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { matchesShape } from '../utils/pageContentValidation.js';
import { aboutContent, careerContent, contactContent } from '../pages/siteContent.js';
import { homeContent } from '../pages/homeContent.js';

const templates = { home: homeContent, about: aboutContent, career: careerContent, 'contact-us': contactContent } as const;
const router = Router();
router.param('slug', (req, res, next, slug) => { if (!(slug in templates)) return errorHandler(res, 404, 'Page not found'); next(); });
router.get('/:slug/template', auth, admin, (req, res) => errorHandler(res, 200, 'Page template retrieved', false, templates[req.params.slug as keyof typeof templates]));
router.get('/:slug', async (req, res) => {
  const slug = req.params.slug as keyof typeof templates;
  try { const page = await prisma.managedPage.findUnique({ where: { slug } }); return errorHandler(res, 200, 'Page retrieved', false, page?.content ?? templates[slug]); }
  catch { return errorHandler(res, 200, 'Default page retrieved', false, templates[slug]); }
});
router.post('/:slug/images', auth, admin, uploadSilImage, uploadImage);
router.put('/:slug', auth, admin, async (req, res) => {
  const slug = req.params.slug as keyof typeof templates;
  if (!matchesShape(req.body, templates[slug])) return errorHandler(res, 400, 'Invalid page content');
  if (slug === 'career') {
    const jobs = req.body.jobs as { id: string }[];
    if (jobs.some(job => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(job.id)) || new Set(jobs.map(job => job.id)).size !== jobs.length) return errorHandler(res, 400, 'Job IDs must be unique URL slugs');
  }
  try { const page = await prisma.managedPage.upsert({ where: { slug }, create: { slug, content: req.body }, update: { content: req.body } }); return errorHandler(res, 200, 'Page updated', false, page.content); }
  catch { return errorHandler(res, 500, 'Unable to update page'); }
});
export default router;
