import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { matchesShape } from '../utils/pageContentValidation.js';
import { compassionContent } from '../pages/compassion/content.js';
let cachedPage: unknown | null = null;
let cachedAt = 0;

export const getCompassionTemplate = (_req: Request, res: Response) =>
  errorHandler(res, 200, 'Compassion template retrieved', false, compassionContent);

export const getCompassionPage = async (_req: Request, res: Response) => {
  if (cachedPage && Date.now() - cachedAt < 30_000) return errorHandler(res, 200, 'Compassion page retrieved', false, cachedPage);
  try {
    const page = await prisma.managedPage.findUnique({ where: { slug: 'compassion-in-action' } });
    cachedPage = page?.content ?? compassionContent;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'Compassion page retrieved', false, cachedPage);
  } catch (error) {
    console.error('Unable to load saved Compassion page', error);
    return errorHandler(res, 200, 'Original Compassion page retrieved', false, compassionContent);
  }
};

export const updateCompassionPage = async (req: Request, res: Response) => {
  if (!matchesShape(req.body, compassionContent)) return errorHandler(res, 400, 'Invalid Compassion page content');
  try {
    const page = await prisma.managedPage.upsert({
      where: { slug: 'compassion-in-action' },
      create: { slug: 'compassion-in-action', content: req.body },
      update: { content: req.body },
    });
    cachedPage = page.content;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'Compassion page updated', false, page.content);
  } catch (error) {
    console.error('Unable to update Compassion page', error);
    return errorHandler(res, 500, 'Unable to update Compassion page');
  }
};
