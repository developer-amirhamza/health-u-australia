import { Router } from 'express';
import {
  getContracts,
  getContractById,
  createContract,
  deleteContract,
  updateContract,
  sendContractPdf,
  sendContractSignatureRequest,
  getContractByToken,
  submitEmployeeSignature,
} from '../controllers/contract.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = Router();

// Any signed-in staff member can submit a new contract from the tool, or
// email a prepared PDF to the employee/contractor.
router.post('/create', auth, createContract);
router.post('/send-pdf', auth, sendContractPdf);
router.post('/send-signature-request', auth, sendContractSignatureRequest);

// PUBLIC — the employee reaches these via the emailed signing link, with
// no account of their own. The token itself is the credential.
router.get('/sign', getContractByToken);
router.post('/sign', submitEmployeeSignature);

// Managing saved contracts is an admin-panel (CRUD) concern.
router.get('/', auth, admin, getContracts);
router.get('/single', auth, admin, getContractById);
router.put('/update', auth, admin, updateContract);
router.delete('/delete', auth, admin, deleteContract);

export default router;
