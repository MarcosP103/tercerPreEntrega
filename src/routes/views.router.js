import { Router } from "express";
import { isPremium, isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import productModel from "../dao/models/products.model.js";

const router = Router();

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", { products: [] });

});

router.get('/premium', isPremium, (req, res) => {
  res.render('premium', { message: 'Página de administración: solo accesible para usuario premium' });
});

router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// router.get("/products", async (req, res) => {
//   try {
//     let page = parseInt(req.query.limit)
//     if(!page) page = 1

//     let options = { page, limit: 5, lean: true }
//     let result = await productModel.paginate({}, options)

//     result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : null;
//     result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : null;
    
//     result.isValid = result.totalPages ? page > 0 && page <= result.totalPages : true;
//     res.render('products', result)

//   } catch (error) {
//     console.error ("Error al obtener los productos: ", error)
//     res.status(500).json({ status: "error", message: "Error interno del servidor"})
//   }
// })

// router.get("/products/:pid", async (req, res) => {
//   const { pid } = req.params
  
//   try {
//     const product = await productModel.findById(pid).lean()
//     if (!product) {
//       return res.status(404).json({ error: "Producto no encontrado" })
//     }

//     res.render("productDetail", { product })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: "Error al obtener el producto" })
//   }
// })

export default router;
