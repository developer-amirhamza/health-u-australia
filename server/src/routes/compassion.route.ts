import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { getCompassionPage, getCompassionTemplate, updateCompassionPage } from '../controllers/compassion.controllers.js';

const router = Router();
router.get('/', getCompassionPage);
router.get('/template', auth, admin, section('compassion'), getCompassionTemplate);
router.post('/images', auth, admin, section('compassion'), uploadSilImage, uploadImage);
router.put('/', auth, admin, section('compassion'), updateCompassionPage);
export default router;
