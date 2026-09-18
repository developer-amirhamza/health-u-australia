import { Router } from 'express';
import {
  getServiceAgreements,
  getServiceAgreementById,
  createServiceAgreement,
  updateServiceAgreement,
  deleteServiceAgreement,
  sendServiceAgreementPdf,
  sendSignatureRequest,
  getServiceAgreementByToken,
  submitParticipantSignature,
} from '../controllers/serviceAgreement.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = Router();

// Any signed-in staff member can submit a new agreement from the tool, or
// email the prepared PDF / a signature request straight to the participant.
router.post('/create', auth, createServiceAgreement);
router.post('/send-pdf', auth, sendServiceAgreementPdf);
router.post('/send-signature-request', auth, sendSignatureRequest);

// PUBLIC — the participant reaches these via the emailed signing link, with
// no account of their own. The token itself is the credential.
router.get('/sign', getServiceAgreementByToken);
router.post('/sign', submitParticipantSignature);

// Managing saved agreements is an admin-panel (CRUD) concern.
router.get('/', auth, admin, getServiceAgreements);
router.get('/single', auth, admin, getServiceAgreementById);
router.put('/update', auth, admin, updateServiceAgreement);
router.delete('/delete', auth, admin, deleteServiceAgreement);

export default router;
