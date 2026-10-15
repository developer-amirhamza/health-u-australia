import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { sendEmail } from '../config/sendEmail.js';
import { primaryClientUrl } from '../config/clientUrl.js';
import contractPdfTemplate from '../utils/contractPdfTemplate.js';
import contractSignatureRequestTemplate from '../utils/contractSignatureRequestTemplate.js';
import contractSignedTemplate from '../utils/contractSignedTemplate.js';

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
        // Not the token itself — just enough to show "Awaiting signature".
        signingTokenExpiresAt: true,
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
    const { signingToken, ...safeContract } = contract;
    return errorHandler(res, 200, 'Contract retrieved', false, safeContract);
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

// Re-saves a contract edited in the generator tool. A signed contract is locked:
// changing it would no longer match what the employee signed. While a signature
// request is out, the link keeps working and shows the updated contract.
export const updateContract = async (req: AuthRequest, res: Response) => {
  try {
    const { id, contractType, employeeName, employeeEmail, position, startDate, data, documentHtml } = req.body;
    if (!id) return errorHandler(res, 400, 'Contract ID is required');
    if (!employeeName || !documentHtml) {
      return errorHandler(res, 400, 'Employee name and the generated document are required');
    }
    const existing = await prisma.contract.findUnique({ where: { id: String(id) } });
    if (!existing) return errorHandler(res, 404, 'Contract not found');
    if (existing.status === 'SIGNED' || existing.employeeSignature) {
      return errorHandler(res, 400, 'This contract has been signed by the employee and can no longer be edited');
    }

    const contract = await prisma.contract.update({
      where: { id: existing.id },
      data: {
        contractType: contractType || '',
        employeeName,
        employeeEmail: employeeEmail || '',
        position: position || '',
        startDate: startDate || '',
        data: data ?? {},
        documentHtml,
      },
    });
    const { signingToken, ...safeContract } = contract;
    return errorHandler(res, 200, 'Contract updated', false, safeContract);
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

const SIGNING_LINK_DAYS = 30;
const SIGNATURE_RE = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The generator tool (client/public/contract-generator.html, renderHTML's
// "accept" block) leaves the employee's signature lines blank, in this exact
// markup. The employee's lines come first; the Health U signatory's follow.
const BLANK_LINE = (label: string) => `<div class="sigline"><span>${label}</span><i></i></div>`;
const FILLED_LINE = (label: string, inner: string) => `<div class="sigline"><span>${label}</span>${inner}</div>`;
const SIG_TEXT = (text: string) =>
  `<em style="flex:1;border-bottom:1px solid #6b7280;font-style:normal;display:block">${escapeHtml(text)}</em>`;

// Writes the employee's signature, name and date into the stored contract
// document, so the admin view, PDF download and email all show it.
const signDocumentHtml = (html: string, signature: string, name: string, date: string) => {
  const sigImg = `<img class="sigimg" src="${signature}" alt="Signature">`;
  const firstSigned = html.indexOf('<div class="sigline"><span>Signed:</span>');
  // Only fill the "Signed:" line if the employee's (first) one is still blank —
  // otherwise the next blank one would be Health U's signatory line.
  if (firstSigned !== -1 && html.startsWith(BLANK_LINE('Signed:'), firstSigned)) {
    let out = html.slice(0, firstSigned) + FILLED_LINE('Signed:', sigImg)
      + html.slice(firstSigned + BLANK_LINE('Signed:').length);
    out = out.replace(BLANK_LINE('Print name:'), FILLED_LINE('Print name:', SIG_TEXT(name)));
    out = out.replace(BLANK_LINE('Date:'), FILLED_LINE('Date:', SIG_TEXT(date)));
    return out;
  }
  // Unrecognised layout: record the signature at the end rather than lose it.
  return html + `<div class="sig"><h4>Signed by the employee</h4>`
    + FILLED_LINE('Signed:', sigImg)
    + FILLED_LINE('Print name:', SIG_TEXT(name))
    + FILLED_LINE('Date:', SIG_TEXT(date)) + `</div>`;
};

const signedInTool = (contract: { data: unknown }) =>
  Boolean((contract.data as any)?.data?.employeeSignature);

// Emails the employee a link to review the contract and add their own
// signature (see /contract/sign), like the Service Agreement flow.
export const sendContractSignatureRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id, toEmail } = req.body;
    if (!id) return errorHandler(res, 400, 'Contract ID is required');
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) return errorHandler(res, 404, 'Contract not found');
    if (contract.employeeSignature || signedInTool(contract)) {
      return errorHandler(res, 400, 'This contract has already been signed by the employee');
    }
    const recipient = String(toEmail || contract.employeeEmail || '').trim();
    if (!EMAIL_RE.test(recipient)) {
      return errorHandler(res, 400, 'A valid employee email is required');
    }

    const signingToken = crypto.randomBytes(32).toString('hex');
    const signingTokenExpiresAt = new Date(Date.now() + SIGNING_LINK_DAYS * 24 * 60 * 60 * 1000);

    const signUrl = `${primaryClientUrl}/contract/sign?token=${signingToken}`;
    await sendEmail({
      sendTo: recipient,
      subject: 'Please sign your contract - Health U Australia',
      html: contractSignatureRequestTemplate({
        employeeName: escapeHtml(contract.employeeName || 'there'),
        signUrl,
      }),
    });

    // Only once the email has gone, so a failed send leaves any earlier link working.
    await prisma.contract.update({
      where: { id },
      data: { signingToken, signingTokenExpiresAt, employeeEmail: recipient, status: 'AWAITING_SIGNATURE' },
    });

    return errorHandler(res, 200, `Signature request sent to ${recipient}`, false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

const findBySigningToken = async (token: unknown) => {
  if (!token) return { error: [400, 'Signing token is required'] as const };
  const contract = await prisma.contract.findUnique({ where: { signingToken: String(token) } });
  if (!contract) return { error: [404, 'Invalid or expired signing link'] as const };
  if (contract.signingTokenExpiresAt && contract.signingTokenExpiresAt.getTime() < Date.now()) {
    return { error: [400, 'This signing link has expired. Please contact Health U Australia for a new one.'] as const };
  }
  return { contract };
};

// PUBLIC (no auth) — the employee opens this via the emailed link.
export const getContractByToken = async (req: Request, res: Response) => {
  try {
    const { contract, error } = await findBySigningToken(req.query.token);
    if (error) return errorHandler(res, error[0], error[1]);
    return errorHandler(res, 200, 'Contract retrieved', false, {
      contract: {
        employeeName: contract!.employeeName,
        contractType: contract!.contractType,
        position: contract!.position,
        documentHtml: contract!.documentHtml,
      },
      alreadySigned: Boolean(contract!.employeeSignature),
    });
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// PUBLIC (no auth) — records only the employee's own signature; nothing
// else about the contract can be changed through this endpoint.
export const submitEmployeeSignature = async (req: Request, res: Response) => {
  try {
    const { token, employeeSignature, employeeSignatureName, accepted } = req.body;
    const name = String(employeeSignatureName || '').trim();
    if (!employeeSignature || !name) return errorHandler(res, 400, 'Signature and full name are required');
    if (!SIGNATURE_RE.test(String(employeeSignature))) return errorHandler(res, 400, 'Invalid signature image');
    if (name.length > 120) return errorHandler(res, 400, 'Name is too long');
    if (!accepted) return errorHandler(res, 400, 'Please confirm you accept the contract');

    const { contract, error } = await findBySigningToken(token);
    if (error) return errorHandler(res, error[0], error[1]);
    if (contract!.employeeSignature) return errorHandler(res, 400, 'This contract has already been signed');

    // Dated by the server, in Health U's own time zone.
    const signedDate = new Intl.DateTimeFormat('en-AU', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Australia/Sydney',
    }).format(new Date());

    await prisma.contract.update({
      where: { id: contract!.id },
      data: {
        employeeSignature,
        employeeSignatureName: name,
        employeeSignedDate: signedDate,
        documentHtml: signDocumentHtml(contract!.documentHtml, employeeSignature, name, signedDate),
        status: 'SIGNED',
      },
    });

    if (contract!.createdById) {
      const creator = await prisma.user.findUnique({
        where: { id: contract!.createdById },
        select: { email: true, firstName: true },
      });
      if (creator?.email) {
        await sendEmail({
          sendTo: creator.email,
          subject: 'Contract Signed - Health U Australia',
          html: contractSignedTemplate({
            firstName: creator.firstName || 'there',
            employeeName: escapeHtml(contract!.employeeName || name),
          }),
        }).catch((err) => console.error('Contract signed-notification email failed:', err.message));
      }
    }

    return errorHandler(res, 200, 'Thank you — your signature has been submitted', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};
