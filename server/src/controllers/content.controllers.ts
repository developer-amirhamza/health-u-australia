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