import { Router } from 'express';
import {
  getPublicHandbookSections,
  getHandbookSections,
  createHandbookSection,
  updateHandbookSection,
  deleteHandbookSection,
} from '../controllers/handbookSection.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';

const router = Router();

// Powers the public /participant-handbook page — published sections only, no auth required.
router.get('/public', getPublicHandbookSections);

// Managing handbook sections is an admin-panel (CRUD) concern.
router.get('/', auth, admin, section('handbook'), getHandbookSections);
router.post('/create', auth, admin, section('handbook'), createHandbookSection);
router.put('/update', auth, admin, section('handbook'), updateHandbookSection);
router.delete('/delete', auth, admin, section('handbook'), deleteHandbookSection);

export default router;
