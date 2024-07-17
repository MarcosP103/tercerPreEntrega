import { Router } from 'express';
import { isAuthenticated } from '../../middleware/auth.js';
import { getAllProducts } from '../../controllers/productsApi.controller.js';

const router = Router();

router.get('/', isAuthenticated, getAllProducts);

export default router;
