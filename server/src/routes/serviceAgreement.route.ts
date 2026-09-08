import { Router } from 'express';
import {
  getServiceAgreements,
  getServiceAgreementById,
  createServiceAgreement,
  updateServiceAgreement,
  deleteServiceAgreement,
} from '../controllers/serviceAgreement.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = Router();

// Any signed-in staff member can submit a new agreement from the tool.
router.post('/create', auth, createServiceAgreement);

// Managing saved agreements is an admin-panel (CRUD) concern.
router.get('/', auth, admin, getServiceAgreements);
router.get('/single', auth, admin, getServiceAgreementById);
router.put('/update', auth, admin, updateServiceAgreement);
router.delete('/delete', auth, admin, deleteServiceAgreement);

export default router;
