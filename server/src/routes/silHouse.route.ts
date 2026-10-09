import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { getSilHouses, getSilHouse, createSilHouse, updateSilHouse, deleteSilHouse, uploadSilHouseImage } from '../controllers/silHouse.controllers.js';

const router = Router();
router.get('/', getSilHouses);
router.get('/:id', getSilHouse);
router.post('/images', auth, admin, uploadSilImage, uploadSilHouseImage);
router.post('/', auth, admin, createSilHouse);
router.put('/:id', auth, admin, updateSilHouse);
router.delete('/:id', auth, admin, deleteSilHouse);
export default router;
