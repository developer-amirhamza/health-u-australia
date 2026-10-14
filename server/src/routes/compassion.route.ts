import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { getCompassionPage, getCompassionTemplate, updateCompassionPage } from '../controllers/compassion.controllers.js';

const router = Router();
router.get('/', getCompassionPage);
router.get('/template', auth, admin, getCompassionTemplate);
router.post('/images', auth, admin, uploadSilImage, uploadImage);
router.put('/', auth, admin, updateCompassionPage);
export default router;
