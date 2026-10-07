import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';

interface AuthRequest extends Request {
  userId?: string;
}

export const CATEGORIES = ['REQUIRED_TRAINING', 'COMMISSION_RESOURCE', 'KNOWLEDGE_RESPONSIBILITY'];

// Public: powers the /training page. Only published items, grouped by
// category and ordered the way the admin panel arranged them.
export const getPublicTrainingResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.trainingResource.findMany({
      where: { isPublished: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, category: true, title: true, description: true, link: true },
    });
    return errorHandler(res, 200, 'Training resources retrieved', false, resources);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

// Admin: the full list (including unpublished) for the admin CRUD table.
export const getTrainingResources = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    const resources = await prisma.trainingResource.findMany({
      where,
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
      include: { createdBy: { select: { id: true, firstName: true, lastName: true } } },
    });
    return errorHandler(res, 200, 'Training resources retrieved', false, resources);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const createTrainingResource = async (req: AuthRequest, res: Response) => {
  try {
    const { category, title, description, link, order, isPublished } = req.body;

    if (!category || !CATEGORIES.includes(category)) {
      return errorHandler(res, 400, `Category must be one of: ${CATEGORIES.join(', ')}`);
    }
    if (!title || !String(title).trim()) {
      return errorHandler(res, 400, 'Title is required');
    }
    if (!link || !String(link).trim()) {
      return errorHandler(res, 400, 'Link is required');
    }

    const resource = await prisma.trainingResource.create({
      data: {
        category,
        title: String(title).trim(),
        description: description ? String(description).trim() : '',
        link: String(link).trim(),
        order: Number.isFinite(Number(order)) ? Number(order) : 0,
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        ...(req.userId ? { createdById: req.userId } : {}),
      },
    });

    return errorHandler(res, 201, 'Training resource created', false, resource);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const updateTrainingResource = async (req: Request, res: Response) => {
  try {
    const { id, category, title, description, link, order, isPublished } = req.body;
    if (!id) return errorHandler(res, 400, 'Training resource ID is required');

    const existing = await prisma.trainingResource.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Training resource not found');

    if (category !== undefined && !CATEGORIES.includes(category)) {
      return errorHandler(res, 400, `Category must be one of: ${CATEGORIES.join(', ')}`);
    }

    const resource = await prisma.trainingResource.update({
      where: { id },
      data: {
        ...(category !== undefined ? { category } : {}),
        ...(title !== undefined ? { title: String(title).trim() } : {}),
        ...(description !== undefined ? { description: String(description).trim() } : {}),
        ...(link !== undefined ? { link: String(link).trim() } : {}),
        ...(order !== undefined ? { order: Number(order) || 0 } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
      },
    });

    return errorHandler(res, 200, 'Training resource updated', false, resource);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};

export const deleteTrainingResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) return errorHandler(res, 400, 'Training resource ID is required');
    const existing = await prisma.trainingResource.findUnique({ where: { id } });
    if (!existing) return errorHandler(res, 404, 'Training resource not found');
    await prisma.trainingResource.delete({ where: { id } });
    return errorHandler(res, 200, 'Training resource deleted', false, null);
  } catch (error: any) {
    return errorHandler(res, 500, error.message || 'Internal server error');
  }
};
