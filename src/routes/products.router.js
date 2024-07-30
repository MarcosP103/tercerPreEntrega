import { Router } from 'express';
import {
  handleGetRealTimeProducts,
  handleGetProducts,
  handleGetProductById,
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct
} from '../controllers/products.controller.js';

const router = Router();

router.get('/realTimeProducts', handleGetRealTimeProducts);

router.get('/', handleGetProducts);

router.get('/:pid', handleGetProductById);

router.post('/', handleAddProduct);

router.put('/:pid', handleUpdateProduct);

router.delete('/:pid', handleDeleteProduct);

export default router;
