import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';

interface AuthRequest extends Request {
  userId?: string;
}
export const getContent = async (req: Request, res: Response) => {
  try {
    const { pageKey } = req.query;

    const where: any = {
      isPublished: true,
    };

    if (pageKey) {
      where.pageKey = String(pageKey);
    }

    const content = await prisma.contentPost.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });

    return errorHandler(
      res,
      200,
      'Content retrieved successfully',
      false,
      content
    );
  } catch (error: any) {
    return errorHandler(
      res,
      500,
      error.message || 'Internal server error'
    );
  }
};

export const createContent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      pageKey,
      section,
      title,
      slug,
      body,
      images,
      order,
      isPublished,
    } = req.body;

    if (!pageKey || !title) {
      return errorHandler(
        res,
        400,
        'Page key and title are required'
      );
    }

    if (!req.userId) {
      return errorHandler(
        res,
        401,
        'Unauthorized'
      );
    }

    const content = await prisma.contentPost.create({
      data: {
        pageKey,
        section: section || null,
        title,
        slug: slug || null,
        body: body ?? null,
        images: images ?? [],
        order: order ?? 0,
        isPublished: isPublished ?? true,
        createdById: req.userId,
      },
    });

    return errorHandler(
      res,
      201,
      'Content created successfully',
      false,
      content
    );
  } catch (error: any) {
    return errorHandler(
      res,
      500,
      error.message || 'Internal server error'
    );
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const {
      id,
      pageKey,
      section,
      title,
      slug,
      body,
      images,
      order,
      isPublished,
    } = req.body;

    if (!id) {
      return errorHandler(res, 400, 'Content ID is required');
    }

    const existing = await prisma.contentPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorHandler(res, 404, 'Content not found');
    }

    const data: any = {};

    if (pageKey !== undefined) data.pageKey = pageKey;
    if (section !== undefined) data.section = section || null;
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug || null;
    if (body !== undefined) data.body = body;
    if (images !== undefined) data.images = images;
    if (order !== undefined) data.order = order;
    if (isPublished !== undefined) data.isPublished = isPublished;

    const updatedContent = await prisma.contentPost.update({
      where: { id },
      data,
    });

    return errorHandler(
      res,
      200,
      'Content updated successfully',
      false,
      updatedContent
    );
  } catch (error: any) {
    return errorHandler(
      res,
      500,
      error.message || 'Internal server error'
    );
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return errorHandler(res, 400, 'Content ID is required');
    }

    const existing = await prisma.contentPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorHandler(res, 404, 'Content not found');
    }

    await prisma.contentPost.delete({
      where: { id },
    });

    return errorHandler(
      res,
      200,
      'Content deleted successfully',
      false,
      null
    );
  } catch (error: any) {
    return errorHandler(
      res,
      500,
      error.message || 'Internal server error'
    );
  }
};