import { Router } from 'express';
import {
  GetRealTimeProducts,
  GetProducts,
  GetProductById,
  AddProduct,
  RenderAddProduct,
  UpdateProduct,
  RenderEditProduct,
  DeleteProduct,
  RenderDeleteProduct
} from '../controllers/products.controller.js';

const router = Router();

router.get('/realTimeProducts', GetRealTimeProducts);

router.get('/', GetProducts);

router.get('/add', RenderAddProduct);
router.post('/', AddProduct);
router.get('/:pid', GetProductById);

router.get('/edit/:pid', RenderEditProduct)
router.put('/:pid', UpdateProduct);

router.get('/delete/:pid', RenderDeleteProduct);
router.delete('/:pid', DeleteProduct);

export default router;
