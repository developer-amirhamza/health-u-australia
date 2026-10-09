import { Router } from 'express';
import {
  getPublicTrainingResources,
  getTrainingResources,
  createTrainingResource,
  updateTrainingResource,
  deleteTrainingResource,
} from '../controllers/trainingResource.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = Router();

// Powers the public /training page — published items only, no auth required.
router.get('/public', getPublicTrainingResources);

// Managing training resources is an admin-panel (CRUD) concern.
router.get('/', auth, admin, getTrainingResources);
router.post('/create', auth, admin, createTrainingResource);
router.put('/update', auth, admin, updateTrainingResource);
router.delete('/delete', auth, admin, deleteTrainingResource);

export default router;
