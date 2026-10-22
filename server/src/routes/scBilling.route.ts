import { Router } from 'express';
import {
  getScPlans,
  createScPlan,
  updateScPlan,
  deleteScPlan,
  getScEntries,
  createScEntry,
  updateScEntry,
  deleteScEntry,
} from '../controllers/scBilling.contrallers.js';
import { auth } from "../middlewares/auth.js"
import { admin, section } from '../middlewares/admin.js';

const router = Router();

// Admin-only tool — every route requires an authenticated admin.
router.get('/plans', auth, admin, section('scBilling'), getScPlans);
router.post('/plans/create', auth, admin, section('scBilling'), createScPlan);
router.put('/plans/update', auth, admin, section('scBilling'), updateScPlan);
router.delete('/plans/delete', auth, admin, section('scBilling'), deleteScPlan);

router.get('/entries', auth, admin, section('scBilling'), getScEntries);
router.post('/entries/create', auth, admin, section('scBilling'), createScEntry);
router.put('/entries/update', auth, admin, section('scBilling'), updateScEntry);
router.delete('/entries/delete', auth, admin, section('scBilling'), deleteScEntry);

export default router;