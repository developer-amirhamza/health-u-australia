import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { matchesShape } from '../utils/pageContentValidation.js';
import { feedbackContent } from '../pages/feedback/content.js';
let cachedPage: unknown | null = null;
let cachedAt = 0;

export const getFeedbackTemplate = (_req: Request, res: Response) =>
  errorHandler(res, 200, 'Feedback template retrieved', false, feedbackContent);

export const getFeedbackPage = async (_req: Request, res: Response) => {
  if (cachedPage && Date.now() - cachedAt < 30_000) return errorHandler(res, 200, 'Feedback page retrieved', false, cachedPage);
  try {
    const page = await prisma.managedPage.findUnique({ where: { slug: 'participant-feedback' } });
    cachedPage = page?.content ?? feedbackContent;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'Feedback page retrieved', false, cachedPage);
  } catch (error) {
    console.error('Unable to load saved Feedback page', error);
    return errorHandler(res, 200, 'Original Feedback page retrieved', false, feedbackContent);
  }
};

export const updateFeedbackPage = async (req: Request, res: Response) => {
  if (!matchesShape(req.body, feedbackContent)) return errorHandler(res, 400, 'Invalid Feedback page content');
  try {
    const page = await prisma.managedPage.upsert({
      where: { slug: 'participant-feedback' },
      create: { slug: 'participant-feedback', content: req.body },
      update: { content: req.body },
    });
    cachedPage = page.content;
    cachedAt = Date.now();
    return errorHandler(res, 200, 'Feedback page updated', false, page.content);
  } catch (error) {
    console.error('Unable to update Feedback page', error);
    return errorHandler(res, 500, 'Unable to update Feedback page');
  }
};
