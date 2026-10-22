import { Router } from 'express';
import {
  getPublicTrainingResources,
  getTrainingResources,
  createTrainingResource,
  updateTrainingResource,
  deleteTrainingResource,
} from '../controllers/trainingResource.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';

const router = Router();

// Powers the public /training page — published items only, no auth required.
router.get('/public', getPublicTrainingResources);

// Managing training resources is an admin-panel (CRUD) concern.
router.get('/', auth, admin, section('training'), getTrainingResources);
router.post('/create', auth, admin, section('training'), createTrainingResource);
router.put('/update', auth, admin, section('training'), updateTrainingResource);
router.delete('/delete', auth, admin, section('training'), deleteTrainingResource);

export default router;
