import { Router } from 'express';
import {
  getContracts,
  getContractById,
  createContract,
  deleteContract,
  sendContractPdf,
} from '../controllers/contract.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = Router();

// Any signed-in staff member can submit a new contract from the tool, or
// email a prepared PDF to the employee/contractor.
router.post('/create', auth, createContract);
router.post('/send-pdf', auth, sendContractPdf);

// Managing saved contracts is an admin-panel (CRUD) concern.
router.get('/', auth, admin, getContracts);
router.get('/single', auth, admin, getContractById);
router.delete('/delete', auth, admin, deleteContract);

export default router;
