import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { getFeedbackPage, getFeedbackTemplate, updateFeedbackPage } from '../controllers/feedback.controllers.js';

const router = Router();
router.get('/', getFeedbackPage);
router.get('/template', auth, admin, section('feedback'), getFeedbackTemplate);
router.post('/images', auth, admin, section('feedback'), uploadSilImage, uploadImage);
router.put('/', auth, admin, section('feedback'), updateFeedbackPage);
export default router;
