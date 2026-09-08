import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';

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
