import { Router } from 'express';
import {
  getContent,
  createContent,
  updateContent,
  deleteContent
} from '../controllers/content.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const contentRouter = Router();

contentRouter.get('/', getContent);

contentRouter.post('/', auth, admin, createContent);
contentRouter.put('/', auth, admin, updateContent);
contentRouter.delete('/', auth, admin, deleteContent);
export default contentRouter;