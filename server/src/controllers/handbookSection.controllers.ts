import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';

interface AuthRequest extends Request {
  userId?: string;
}

const MAX_HEADING_LENGTH = 300;
const MAX_CONTENT_LENGTH = 50000;

const ORDER_BY = [{ order: 'asc' as const }, { createdAt: 'asc' as const }];

// Returns an error message, or null when the fields that were sent are valid.
// `required` is true on create, where part and title must be present.
const validate = (body: any, required: boolean): string | null => {
  const { part, title, content } = body;
  if (required || part !== undefined) {
    if (!part || !String(part).trim()) return 'Handbook part is required';
    if (String(part).trim().length > MAX_HEADING_LENGTH) return `Part must be ${MAX_HEADING_LENGTH} characters or fewer`;
  }
  if (required || title !== undefined) {
    if (!title || !String(title).trim()) return 'Title is required';
    if (String(title).trim().length > MAX_HEADING_LENGTH) return `Title must be ${MAX_HEADING_LENGTH} characters or fewer`;
  }
  if (content !== undefined && String(content).length > MAX_CONTENT_LENGTH) {
    return `Content must be ${MAX_CONTENT_LENGTH} characters or fewer`;
  }
  return null;
};

// Public: powers the /participant-handbook page. Published sections only.
export const getPublicHandbookSections = async (req: Request, res: Response) => {
  try {
    const sections = await prisma.handbookSection.findMany({
      where: { isPublished: true },
      orderBy: ORDER_BY,
      select: { id: true, part: true, title: true, content: true, updatedAt: true },
    });
    return errorHandler(res, 200, 'Handbook sections retrieved', false, sections);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// Admin: the full list (including unpublished) for the admin CRUD table.
export const getHandbookSections = async (req: Request, res: Response) => {
  try {
    const { part } = req.query;
    const where: any = {};
    if (part) where.part = String(part);
    const sections = await prisma.handbookSection.findMany({
      where,
      orderBy: ORDER_BY,
      include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });
    return errorHandler(res, 200, 'Handbook sections retrieved', false, sections);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const createHandbookSection = async (req: AuthRequest, res: Response) => {
  try {
    const invalid = validate(req.body, true);
    if (invalid) return errorHandler(res, 400, invalid);

    const { part, title, content, order, isPublished } = req.body;
    const section = await prisma.handbookSection.create({
      data: {
        part: String(part).trim(),
        title: String(title).trim(),
        content: content ? String(content).trim() : '',
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        ...(req.userId ? { createdById: req.userId } : {}),
      },
    });

    return errorHandler(res, 201, 'Handbook section created', false, section);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const updateHandbookSection = async (req: Request, res: Response) => {
  try {
    const { id, part, title, content, order, isPublished } = req.body;
    if (!id) return errorHandler(res, 400, 'Handbook section ID is required');

    const invalid = validate(req.body, false);
    if (invalid) return errorHandler(res, 400, invalid);

    const existing = await prisma.handbookSection.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Handbook section not found');

    const section = await prisma.handbookSection.update({
      where: { id },
      data: {
        ...(part !== undefined ? { part: String(part).trim() } : {}),
        ...(title !== undefined ? { title: String(title).trim() } : {}),
        ...(content !== undefined ? { content: String(content).trim() } : {}),
        ...(order !== undefined ? { order: Number(order) || 0 } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
    });

    return errorHandler(res, 200, 'Handbook section updated', false, section);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const deleteHandbookSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Handbook section ID is required');
    const existing = await prisma.handbookSection.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Handbook section not found');
    await prisma.handbookSection.delete({ where: { id } });
    return errorHandler(res, 200, 'Handbook section deleted', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};
