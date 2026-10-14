import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { uploadImage } from '../controllers/uploadImage.controllers.js';
import { getNdisPage, getNdisTemplate, updateNdisPage } from '../controllers/ndis.controllers.js';

const router = Router();
router.get('/', getNdisPage);
router.get('/template', auth, admin, getNdisTemplate);
router.post('/images', auth, admin, uploadSilImage, uploadImage);
router.put('/', auth, admin, updateNdisPage);
export default router;
