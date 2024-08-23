import { Router } from 'express';
import {
  GetRealTimeProducts,
  GetProducts,
  GetProductById,
  AddProduct,
  UpdateProduct,
  RenderEditProduct,
  DeleteProduct
} from '../controllers/products.controller.js';

const router = Router();

router.get('/realTimeProducts', GetRealTimeProducts);

router.get('/', GetProducts);
router.get('/:pid', GetProductById);

router.post('/', AddProduct);

router.get('/edit/:pid', RenderEditProduct)
router.put('/:pid', UpdateProduct);

router.delete('/:pid', DeleteProduct);

export default router;
