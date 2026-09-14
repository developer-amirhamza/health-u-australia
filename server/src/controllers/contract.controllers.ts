import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { sendEmail } from '../config/sendEmail.js';
import contractPdfTemplate from '../utils/contractPdfTemplate.js';

interface AuthRequest extends Request {
  userId?: string;
}

export const getContracts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const where: any = {};
    if (search) {
      where.OR = [
        { employeeName: { contains: String(search), mode: 'insensitive' } },
        { employeeEmail: { contains: String(search), mode: 'insensitive' } },
        { position: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    const contracts = await prisma.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        contractType: true,
        employeeName: true,
        employeeEmail: true,
        position: true,
        startDate: true,
        createdAt: true,
        updatedAt: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    return errorHandler(res, 200, 'Contracts retrieved', false, contracts);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) return errorHandler(res, 400, 'Contract ID is required');
    const contract = await prisma.contract.findUnique({
      where: { id: String(id) },
      include: { createdBy: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    if (!contract) return errorHandler(res, 404, 'Contract not found');
    return errorHandler(res, 200, 'Contract retrieved', false, contract);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const createContract = async (req: AuthRequest, res: Response) => {
  try {
    const { contractType, employeeName, employeeEmail, position, startDate, data, documentHtml } = req.body;

    if (!employeeName || !documentHtml) {
      return errorHandler(res, 400, 'Employee name and the generated document are required');
    }

    const contract = await prisma.contract.create({
      data: {
        contractType: contractType || '',
        employeeName,
        employeeEmail: employeeEmail || '',
        position: position || '',
        startDate: startDate || '',
        data: data ?? {},
        documentHtml,
        ...(req.userId ? { createdById: req.userId } : {}),
      },
    });

    return errorHandler(res, 201, 'Contract saved', false, contract);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Contract ID is required');
    const existing = await prisma.contract.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Contract not found');
    await prisma.contract.delete({ where: { id } });
    return errorHandler(res, 200, 'Contract deleted', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails the admin-panel-generated PDF (built client-side from a Contract's
// stored documentHtml) to the employee/contractor.
export const sendContractPdf = async (req: AuthRequest, res: Response) => {
  try {
    const { toEmail, employeeName, pdfBase64 } = req.body;
    if (!toEmail || !EMAIL_RE.test(String(toEmail))) {
      return errorHandler(res, 400, 'A valid recipient email is required');
    }
    if (!pdfBase64) {
      return errorHandler(res, 400, 'PDF data is required');
    }

    const buffer = Buffer.from(String(pdfBase64), 'base64');
    const safeName = String(employeeName || 'Contract').trim().replace(/[^a-z0-9]+/gi, '-');

    await sendEmail({
      sendTo: toEmail,
      subject: 'Your Contract - Health U Australia',
      html: contractPdfTemplate({ employeeName: employeeName || 'there' }),
      attachments: [{ filename: `Contract-${safeName}.pdf`, content: buffer }],
    });

    return errorHandler(res, 200, 'Contract emailed to the recipient', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};
