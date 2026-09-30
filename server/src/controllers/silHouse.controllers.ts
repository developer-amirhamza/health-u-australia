import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { errorHandler } from '../utils/errorHandler.js';
import { SilHouseValidationError, validateSilHouse } from '../utils/silHouseValidation.js';
import { uploadImageCloudinary } from '../config/cloudinary.js';

function failure(res: Response, error: unknown) {
  if (error instanceof SilHouseValidationError) return errorHandler(res, 400, error.message);
  if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
    return errorHandler(res, 404, 'SIL house not found');
  }
  console.error('SIL house request failed', error);
  return errorHandler(res, 500, 'Unable to process SIL house request');
}

export const getSilHouses = async (_req: Request, res: Response) => {
  try {
    const houses = await prisma.silHouse.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] });
    return errorHandler(res, 200, 'SIL houses retrieved', false, houses);
  } catch (error) { return failure(res, error); }
};

export const getSilHouse = async (req: Request, res: Response) => {
  try {
    const house = await prisma.silHouse.findUnique({ where: { id: String(req.params.id) } });
    if (!house) return errorHandler(res, 404, 'SIL house not found');
    return errorHandler(res, 200, 'SIL house retrieved', false, house);
  } catch (error) { return failure(res, error); }
};

export const createSilHouse = async (req: Request, res: Response) => {
  try {
    const house = await prisma.silHouse.create({ data: validateSilHouse(req.body) });
    return errorHandler(res, 201, 'SIL house created', false, house);
  } catch (error) { return failure(res, error); }
};

export const updateSilHouse = async (req: Request, res: Response) => {
  try {
    const house = await prisma.silHouse.update({ where: { id: String(req.params.id) }, data: validateSilHouse(req.body) });
    return errorHandler(res, 200, 'SIL house updated', false, house);
  } catch (error) { return failure(res, error); }
};

export const deleteSilHouse = async (req: Request, res: Response) => {
  try {
    await prisma.silHouse.delete({ where: { id: String(req.params.id) } });
    return errorHandler(res, 200, 'SIL house deleted', false);
  } catch (error) { return failure(res, error); }
};

export const uploadSilHouseImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) return errorHandler(res, 400, 'Select an image to upload');
    const uploaded = await uploadImageCloudinary(req.file) as { secure_url: string };
    return errorHandler(res, 201, 'Image uploaded', false, { url: uploaded.secure_url });
  } catch (error) { return failure(res, error); }
};
