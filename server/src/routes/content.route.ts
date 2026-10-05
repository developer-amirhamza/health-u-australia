import { Router } from 'express';
import { getContent } from '../controllers/content.controllers.js';

const contentRouter = Router();

contentRouter.get('/', getContent);

export default contentRouter;