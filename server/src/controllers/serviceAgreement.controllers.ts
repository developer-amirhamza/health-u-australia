import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { sendEmail } from '../config/sendEmail.js';
import agreementSubmittedTemplate from '../utils/agreementSubmittedTemplate.js';
import serviceAgreementPdfTemplate from '../utils/serviceAgreementPdfTemplate.js';

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
