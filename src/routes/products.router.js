import { Router } from 'express'
import productModel from '../dao/models/products.model.js';
import ProductManagerMongoose from '../dao/managerMongo/productManagerMongo.js';
import mongoose from 'mongoose';

const router = Router();
const productManagerM = new ProductManagerMongoose

router.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productManagerM.uploadProducts()
    res.render('index', {products, length : products.length > 0 ? true : false})
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})

//MongoDB
// router.get("/", async (req, res) => {
//   try {
//     let product = await productModel.find();
//     res.send({ result: "success", payload: product });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ result: 'error', message: "Error al cargar los productos" })
//   }
// });

// router.post("/", async (req, res) => {
//   let { title, description, code, price, status, stock, category, thumbnails } = req.body;
//   if (!title || !description || !code || !price || !status || !stock || !category ) {
//     res.status(400).send({ status: "error", error: "Faltan parametros" });
//   }
//   let result = await productModel.create({ title, description, code, price, status, stock, category, thumbnails });
//   res.send({ result: "success", payload: result });
// });

// router.put("/:uid", async (req, res) => {
//     let {uid} = req.params
//     let productToReplace = req.body

//     if(!productToReplace.title || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.status || !productToReplace.stock || !productToReplace.category || !productToReplace.thumbnails){
//         res.send({ status: "error", error: "Parametros no definidos"})
//     }

//     let result = await productModel.updateOne({_id:uid}, productToReplace)
//     res.send({result: "success", payload: result})
// }); 

// router.delete("/:uid", async (req, res) => {
//     let {uid} = req.params
//     let result = await productModel.deleteOne({_id:uid})
//     res.send({result: "success", payload: result})

// });

//Obtener productos con paginación y filtros
router.get("/", async (req, res) => {
  try {
      let { limit, page, sort, query } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 1;
      sort = sort || '';
      query = query || '';

      let filter = {};

      if (query) {
          const categoryRegex = new RegExp(`^${query}$`, 'i');
          filter = { category: categoryRegex };
      }

      let options = {
          page: page,
          limit: limit,
          sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
          lean: true
      };

      let result = await productModel.paginate(filter, options);

      const { totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
      const prevLink = hasPrevPage ? `${req.baseUrl}/get?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
      const nextLink = hasNextPage ? `${req.baseUrl}/get?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

      console.log(`
      Paginación:
      Total Pages: ${totalPages}
      Prev Page: ${prevPage}
      Next Page: ${nextPage}
      Current Page: ${currentPage}
      Has Prev Page: ${hasPrevPage}
      Has Next Page: ${hasNextPage}
      Prev Link: ${prevLink}
      Next Link: ${nextLink}
      `);

      console.log(result.docs);
      res.render('index', { products: result.docs, prevLink: prevLink, nextLink: nextLink });
  } catch (error) {
      console.error("No se pudieron obtener los productos", error);
      res.status(500).json({ status: 'error', message: "No se pudieron obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
      const pId = req.params.pid;

      if (!mongoose.Types.ObjectId.isValid(pId)) {
          return res.status(400).send({ status: "error", error: "ID inválido" });
      }

      const objectId = new mongoose.Types.ObjectId(pId);
      const product = await productModel.findById(objectId);

      if (!product) {
          return res.status(404).send({ status: "error", error: "Producto no encontrado" });
      }

      res.render('productsDet', {
          id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          status: product.status,
          stock: product.stock,
          category: product.category,
          thumbnails: product.thumbnails
      });
  } catch (error) {
      console.error("No se pudo obtener el producto por ID", error);
      res.status(500).send({ status: "error", error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  try {
    await productManagerM.addProduct(title, description, code, price, status, stock, category, thumbnails)
    res.status(201).json({ message: "Producto agregado correctamente" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al agregar el producto"})
  }
})

router.put("/:pid", async (req, res) => {
  const { id }= req.params
  const productMod = req.body

  try {
    const updatedProduct = await productManagerM.modProduct(id, productMod)
    if(!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }
    res.json({ message: "Producto modificado correctamente", product: updatedProduct })
  } catch(error) {
    console.error(error)
    res.status(500).json({ error: "Error al modificar el producto" })
  }
})

router.delete("/:pid", async (req, res) => {
  const { id } = req.params

  try {
    await productManagerM.delProduct(id)
    res.json({ message: "Producto eliminado correctamente"})
  } catch (error){
    console.error(error)
    res.status(500).json({ error: "Error al eliminar el producto" })
  }
})


export default router;