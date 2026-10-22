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
  sendEmployeeSignedCopy,
} from '../controllers/contract.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin, section, moderatorSection } from '../middlewares/admin.js';

const router = Router();

// Any signed-in staff member can submit a new contract from the tool, or
// email a prepared PDF to the employee/contractor.
router.post('/create', auth, moderatorSection('contracts'), createContract);
router.post('/send-pdf', auth, moderatorSection('contracts'), sendContractPdf);
router.post('/send-signature-request', auth, moderatorSection('contracts'), sendContractSignatureRequest);

// PUBLIC — the employee reaches these via the emailed signing link, with
// no account of their own. The token itself is the credential.
router.get('/sign', getContractByToken);
router.post('/sign', submitEmployeeSignature);
router.post('/sign/send-copy', sendEmployeeSignedCopy);

// Managing saved contracts is an admin-panel (CRUD) concern.
router.get('/', auth, admin, section('contracts'), getContracts);
router.get('/single', auth, admin, section('contracts'), getContractById);
router.put('/update', auth, admin, section('contracts'), updateContract);
router.delete('/delete', auth, admin, section('contracts'), deleteContract);

export default router;
