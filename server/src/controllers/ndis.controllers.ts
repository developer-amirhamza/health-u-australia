import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { matchesShape } from '../utils/pageContentValidation.js';
import { ndisContent } from '../pages/ndis/content.js';
let cachedPage: unknown | null = null;
let cachedAt = 0;

export const getNdisTemplate = (_req: Request, res: Response) =>
  errorHandler(res, 200, 'NDIS template retrieved', false, ndisContent);

export const getNdisPage = async (_req: Request, res: Response) => {
  if (cachedPage && Date.now() - cachedAt < 30_000) return errorHandler(res, 200, 'NDIS page retrieved', false, cachedPage);
  try {
    const page = await prisma.managedPage.findUnique({ where: { slug: 'ndis' } });
    cachedPage = page?.content ?? ndisContent;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'NDIS page retrieved', false, cachedPage);
  } catch (error) {
    console.error('Unable to load saved NDIS page', error);
    return errorHandler(res, 200, 'Original NDIS page retrieved', false, ndisContent);
  }
};

export const updateNdisPage = async (req: Request, res: Response) => {
  if (!matchesShape(req.body, ndisContent)) return errorHandler(res, 400, 'Invalid NDIS page content');
  try {
    const page = await prisma.managedPage.upsert({
      where: { slug: 'ndis' },
      create: { slug: 'ndis', content: req.body },
      update: { content: req.body },
    });
    cachedPage = page.content;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'NDIS page updated', false, page.content);
  } catch (error) {
    console.error('Unable to update NDIS page', error);
    return errorHandler(res, 500, 'Unable to update NDIS page');
  }
};
