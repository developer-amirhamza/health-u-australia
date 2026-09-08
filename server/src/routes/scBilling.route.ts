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
import { admin } from '../middlewares/admin.js';

const router = Router();

// Admin-only tool — every route requires an authenticated admin.
router.get('/plans', auth, admin, getScPlans);
router.post('/plans/create', auth, admin, createScPlan);
router.put('/plans/update', auth, admin, updateScPlan);
router.delete('/plans/delete', auth, admin, deleteScPlan);

router.get('/entries', auth, admin, getScEntries);
router.post('/entries/create', auth, admin, createScEntry);
router.put('/entries/update', auth, admin, updateScEntry);
router.delete('/entries/delete', auth, admin, deleteScEntry);

export default router;