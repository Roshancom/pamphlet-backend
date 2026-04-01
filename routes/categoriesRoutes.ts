import { getAllCategories } from '../controllers/categoriesController.js';
import express from 'express';

const router = express.Router();

router.get('/', getAllCategories);

export default router;
