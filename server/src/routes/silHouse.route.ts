import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';
import { uploadSilImage } from '../middlewares/upload.js';
import { getSilHouses, getSilHouse, createSilHouse, updateSilHouse, deleteSilHouse, uploadSilHouseImage } from '../controllers/silHouse.controllers.js';

const router = Router();
router.get('/', getSilHouses);
router.get('/:id', getSilHouse);
router.post('/images', auth, admin, section('silHouses'), uploadSilImage, uploadSilHouseImage);
router.post('/', auth, admin, section('silHouses'), createSilHouse);
router.put('/:id', auth, admin, section('silHouses'), updateSilHouse);
router.delete('/:id', auth, admin, section('silHouses'), deleteSilHouse);
export default router;
