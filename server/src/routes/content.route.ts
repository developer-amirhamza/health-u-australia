import { Router } from 'express';
import {
  getContent,
  createContent,
  updateContent,
  deleteContent
} from '../controllers/content.controllers.js';
import { auth } from '../middlewares/auth.js';
import { admin, section } from '../middlewares/admin.js';

const contentRouter = Router();

contentRouter.get('/', getContent);

contentRouter.post('/', auth, admin, section('services'), createContent);
contentRouter.put('/', auth, admin, section('services'), updateContent);
contentRouter.delete('/', auth, admin, section('services'), deleteContent);
export default contentRouter;