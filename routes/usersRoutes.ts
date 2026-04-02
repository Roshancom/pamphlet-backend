import { protect } from '../middleware/protectMiddleware.js';
import { getUserById, getUsers } from '../controllers/usersController.js';
import express from 'express';

const router = express.Router();

router.get('/', protect, getUsers);

router.get('/:id', protect, getUserById);

export default router;
