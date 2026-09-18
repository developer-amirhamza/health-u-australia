import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { sendEmail } from '../config/sendEmail.js';
import { primaryClientUrl } from '../config/clientUrl.js';
import agreementSubmittedTemplate from '../utils/agreementSubmittedTemplate.js';
import serviceAgreementPdfTemplate from '../utils/serviceAgreementPdfTemplate.js';
import serviceAgreementSignatureRequestTemplate from '../utils/serviceAgreementSignatureRequestTemplate.js';
import serviceAgreementSignedTemplate from '../utils/serviceAgreementSignedTemplate.js';

interface AuthRequest extends Request {
  userId?: string;
}

// Every field the Service Agreement Tool form
// (client/src/app/components/ServiceAgreementForm.tsx) can submit, besides
// the required fields and `items` which are handled separately below.
const AGREEMENT_FIELDS = [
  'supportsProvided',
  'livesAlone',
  'managementType',
  'planManagerName',
  'planManagerEmail',
  'cancellationPolicyAcknowledged',
  'consentInfoConfidential',
  'consentChangeAnytime',
  'consentMedication',
  'consentMoneyManagement',
  'consentPhotosService',
  'consentPhotosMedia',
  'consentPublishFeedback',
  'contactEmail',
  'hasAlternativeContact',
  'altRelationship',
  'altContactName',
  'altContactNumber',
  'altContactEmail',
  'orgContactName',
  'orgPhone',
  'orgEmail',
  'orgPostalAddress',
  'quoteNumber',
  'quoteDate',
  'planStartDate',
  'planEndDate',
  'preparedBy',
  'contactPerson',
  'applyGst',
  'agreementExplained',
  'participantSignature',
  'participantSignatureName',
  'participantSignedDate',
  'providerSignature',
  'providerSignatureName',
  'providerSignedDate',
] as const;

// Both signatures present -> the agreement has been signed by both parties.
const deriveStatus = (data: { participantSignature?: string; providerSignature?: string }) =>
  data.participantSignature && data.providerSignature ? 'SIGNED' : 'DRAFT';

export const getServiceAgreements = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { participantName: { contains: String(search), mode: 'insensitive' } },
        { participantNdisNumber: { contains: String(search), mode: 'insensitive' } },
        { quoteNumber: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    const agreements = await prisma.serviceAgreement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        participantName: true,
        participantNdisNumber: true,
        agreementStartDate: true,
        agreementEndDate: true,
        quoteNumber: true,
        managementType: true,
        // Not the signature image itself (large base64) — just enough to
        // show an "Awaiting signature" indicator on the list.
        signingToken: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return errorHandler(res, 200, 'Service agreements retrieved', false, agreements);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const getServiceAgreementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) return errorHandler(res, 400, 'Agreement ID is required');
    const agreement = await prisma.serviceAgreement.findUnique({
      where: { id: String(id) },
      include: { createdBy: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    if (!agreement) return errorHandler(res, 404, 'Service agreement not found');
    return errorHandler(res, 200, 'Service agreement retrieved', false, agreement);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const createServiceAgreement = async (req: AuthRequest, res: Response) => {
  try {
    const {
      participantName,
      participantNdisNumber,
      participantRepName,
      agreementStartDate,
      agreementEndDate,
      contactAddress,
      contactPhone,
      items,
    } = req.body;

    if (
      !participantName ||
      !participantNdisNumber ||
      !participantRepName ||
      !agreementStartDate ||
      !agreementEndDate ||
      !contactAddress ||
      !contactPhone
    ) {
      return errorHandler(
        res,
        400,
        'Participant name, NDIS number, representative name, agreement dates, address and phone are required',
      );
    }

    const data: any = {
      participantName,
      participantNdisNumber,
      participantRepName,
      agreementStartDate,
      agreementEndDate,
      contactAddress,
      contactPhone,
      items: Array.isArray(items) ? items : [],
    };
    for (const key of AGREEMENT_FIELDS) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    data.status = deriveStatus(data);
    if (req.userId) data.createdById = req.userId;

    const agreement = await prisma.serviceAgreement.create({ data });

    if (req.userId) {
      const submitter = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { email: true, firstName: true },
      });
      if (submitter?.email) {
        await sendEmail({
          sendTo: submitter.email,
          subject: 'Service Agreement Submitted - Health U Australia',
          html: agreementSubmittedTemplate({
            firstName: submitter.firstName || 'there',
            participantName: agreement.participantName,
            quoteNumber: agreement.quoteNumber || undefined,
          }),
        }).catch((err) => console.error('Service agreement confirmation email failed:', err.message));
      }
    }

    return errorHandler(res, 201, 'Service agreement saved', false, agreement);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const updateServiceAgreement = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Agreement ID is required');
    const existing = await prisma.serviceAgreement.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Service agreement not found');

    const data: any = {};
    const UPDATABLE_FIELDS = [
      'participantName',
      'participantNdisNumber',
      'participantRepName',
      'agreementStartDate',
      'agreementEndDate',
      'contactAddress',
      'contactPhone',
      'items',
      ...AGREEMENT_FIELDS,
    ] as const;
    for (const key of UPDATABLE_FIELDS) {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    }
    // Status follows the signatures unless the caller is explicitly
    // archiving the agreement.
    if (req.body.status === 'ARCHIVED') {
      data.status = 'ARCHIVED';
    } else if (data.participantSignature !== undefined || data.providerSignature !== undefined) {
      data.status = deriveStatus({
        participantSignature: data.participantSignature ?? existing.participantSignature,
        providerSignature: data.providerSignature ?? existing.providerSignature,
      });
    }

    const updated = await prisma.serviceAgreement.update({ where: { id }, data });
    return errorHandler(res, 200, 'Service agreement updated', false, updated);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// Emails the participant a link to review the agreement and add their own
// signature (see /service-agreement/sign), instead of the admin capturing
// it on the participant's behalf.
export const sendSignatureRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Agreement ID is required');
    const agreement = await prisma.serviceAgreement.findUnique({ where: { id } });
    if (!agreement) return errorHandler(res, 404, 'Service agreement not found');
    if (!agreement.contactEmail) {
      return errorHandler(res, 400, "This agreement has no participant email under Contact Details");
    }

    const signingToken = crypto.randomBytes(32).toString('hex');
    const signingTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await prisma.serviceAgreement.update({
      where: { id },
      data: { signingToken, signingTokenExpiresAt },
    });

    const signUrl = `${primaryClientUrl}/service-agreement/sign?token=${signingToken}`;
    await sendEmail({
      sendTo: agreement.contactEmail,
      subject: 'Please sign your NDIS Service Agreement - Health U Australia',
      html: serviceAgreementSignatureRequestTemplate({
        participantRepName: agreement.participantRepName || 'there',
        signUrl,
      }),
    });

    return errorHandler(res, 200, `Signature request sent to ${agreement.contactEmail}`, false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// PUBLIC (no auth) — the participant opens this via the emailed link.
export const getServiceAgreementByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) return errorHandler(res, 400, 'Signing token is required');
    const agreement = await prisma.serviceAgreement.findUnique({ where: { signingToken: String(token) } });
    if (!agreement) return errorHandler(res, 404, 'Invalid or expired signing link');
    if (agreement.signingTokenExpiresAt && agreement.signingTokenExpiresAt.getTime() < Date.now()) {
      return errorHandler(res, 400, 'This signing link has expired. Please contact Health U Australia for a new one.');
    }

    const { createdById, signingToken, signingTokenExpiresAt, ...safeAgreement } = agreement;
    return errorHandler(res, 200, 'Service agreement retrieved', false, {
      agreement: safeAgreement,
      alreadySigned: Boolean(agreement.participantSignature),
    });
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// PUBLIC (no auth) — records only the participant's own signature fields;
// nothing else about the agreement can be changed through this endpoint.
export const submitParticipantSignature = async (req: Request, res: Response) => {
  try {
    const { token, participantSignature, participantSignatureName, participantSignedDate, agreementExplained } = req.body;
    if (!token) return errorHandler(res, 400, 'Signing token is required');
    if (!participantSignature || !participantSignatureName || !participantSignedDate) {
      return errorHandler(res, 400, 'Signature, name and date are required');
    }

    const agreement = await prisma.serviceAgreement.findUnique({ where: { signingToken: String(token) } });
    if (!agreement) return errorHandler(res, 404, 'Invalid or expired signing link');
    if (agreement.signingTokenExpiresAt && agreement.signingTokenExpiresAt.getTime() < Date.now()) {
      return errorHandler(res, 400, 'This signing link has expired. Please contact Health U Australia for a new one.');
    }
    if (agreement.participantSignature) {
      return errorHandler(res, 400, 'This agreement has already been signed');
    }

    const status = deriveStatus({ participantSignature, providerSignature: agreement.providerSignature });
    const updated = await prisma.serviceAgreement.update({
      where: { id: agreement.id },
      data: {
        participantSignature,
        participantSignatureName,
        participantSignedDate,
        agreementExplained: Boolean(agreementExplained),
        status,
      },
    });

    if (agreement.createdById) {
      const creator = await prisma.user.findUnique({
        where: { id: agreement.createdById },
        select: { email: true, firstName: true },
      });
      if (creator?.email) {
        await sendEmail({
          sendTo: creator.email,
          subject: 'Service Agreement Signed - Health U Australia',
          html: serviceAgreementSignedTemplate({
            firstName: creator.firstName || 'there',
            participantName: agreement.participantName,
          }),
        }).catch((err) => console.error('Signed-notification email failed:', err.message));
      }
    }

    return errorHandler(res, 200, 'Thank you — your signature has been submitted', false, updated);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails the client-facing PDF (generated on the tool's frontend from the
// filled-in form) straight to the participant. Not tied to a saved
// ServiceAgreement record — staff can send a copy without saving first.
export const sendServiceAgreementPdf = async (req: AuthRequest, res: Response) => {
  try {
    const { toEmail, participantName, pdfBase64 } = req.body;
    if (!toEmail || !EMAIL_RE.test(String(toEmail))) {
      return errorHandler(res, 400, 'A valid recipient email is required');
    }
    if (!pdfBase64) {
      return errorHandler(res, 400, 'PDF data is required');
    }

    const buffer = Buffer.from(String(pdfBase64), 'base64');
    const safeName = String(participantName || 'Participant').trim().replace(/[^a-z0-9]+/gi, '-');

    await sendEmail({
      sendTo: toEmail,
      subject: 'Your NDIS Service Agreement - Health U Australia',
      html: serviceAgreementPdfTemplate({ participantName: participantName || 'there' }),
      attachments: [{ filename: `Service-Agreement-${safeName}.pdf`, content: buffer }],
    });

    return errorHandler(res, 200, 'Service agreement emailed to the client', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const deleteServiceAgreement = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Agreement ID is required');
    const existing = await prisma.serviceAgreement.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Service agreement not found');
    await prisma.serviceAgreement.delete({ where: { id } });
    return errorHandler(res, 200, 'Service agreement deleted', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};
