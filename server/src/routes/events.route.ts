import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { eventsContent } from '../pages/eventsContent.js';

const router = Router();
const text = (value: unknown) => typeof value === 'string' && value.length <= 10000;
const image = (value: unknown) => text(value) && ((value as string).startsWith('/') || (value as string).startsWith('https://'));
const lines = (value: unknown) => Array.isArray(value) && value.length <= 100 && value.every(text);
function validEvent(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;
  const keys = ['id', 'status', 'title', 'timeHeading', 'time', 'date', 'locationHeading', 'location', 'intro', 'overview', 'waiver', 'image', 'galleryTitle', 'gallery', 'audience'];
  return Object.keys(event).length === keys.length && keys.every(key => key in event)
    && ['id', 'title', 'timeHeading', 'time', 'date', 'locationHeading', 'location', 'waiver', 'galleryTitle'].every(key => text(event[key]))
    && (event.id as string).trim().length > 0 && ['current', 'past'].includes(event.status as string)
    && image(event.image) && lines(event.intro) && lines(event.overview) && lines(event.audience)
    && Array.isArray(event.gallery) && event.gallery.length <= 100 && event.gallery.every(image);
}
router.get('/template', auth, admin, section('events'), (_req, res) => errorHandler(res, 200, 'Event template retrieved', false, eventsContent));
router.get('/', async (_req, res) => {
  try { const page = await prisma.managedPage.findUnique({ where: { slug: 'events' } }); return errorHandler(res, 200, 'Events retrieved', false, page?.content ?? eventsContent); }
  catch { return errorHandler(res, 200, 'Default events retrieved', false, eventsContent); }
});
router.post('/images', auth, admin, section('events'), uploadSilImage, uploadImage);
router.put('/', auth, admin, section('events'), async (req, res) => {
  if (!req.body || !Array.isArray(req.body.events) || req.body.events.length > 100 || Object.keys(req.body).length !== 1 || !req.body.events.every(validEvent)) return errorHandler(res, 400, 'Invalid events');
  const events = req.body.events as { id: string; status: string }[];
  if (new Set(events.map(event => event.id)).size !== events.length) return errorHandler(res, 400, 'Event IDs must be unique');
  try { const page = await prisma.managedPage.upsert({ where: { slug: 'events' }, create: { slug: 'events', content: req.body }, update: { content: req.body } }); return errorHandler(res, 200, 'Events updated', false, page.content); }
  catch { return errorHandler(res, 500, 'Unable to save events'); }
});
export default router;
