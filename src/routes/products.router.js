import { Router } from 'express'
import productModel from '../dao/models/products.model.js';
import ProductManagerMongoose from '../dao/managerMongo/productManagerMongo.js';

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
router.get("/", async (req, res) => {
  try {
    let product = await productModel.find();
    res.send({ result: "success", payload: product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ result: 'error', message: "Error al cargar los productos" })
  }
});

router.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category ) {
    res.status(400).send({ status: "error", error: "Faltan parametros" });
  }
  let result = await productModel.create({ title, description, code, price, status, stock, category, thumbnails });
  res.send({ result: "success", payload: result });
});

router.put("/:uid", async (req, res) => {
    let {uid} = req.params
    let productToReplace = req.body

    if(!productToReplace.title || !productToReplace.description || !productToReplace.code || !productToReplace.price || !productToReplace.status || !productToReplace.stock || !productToReplace.category || !productToReplace.thumbnails){
        res.send({ status: "error", error: "Parametros no definidos"})
    }

    let result = await productModel.updateOne({_id:uid}, productToReplace)
    res.send({result: "success", payload: result})
}); 

router.delete("/:uid", async (req, res) => {
    let {uid} = req.params
    let result = await productModel.deleteOne({_id:uid})
    res.send({result: "success", payload: result})

});

//Obtener productos con paginación y filtros
router.get("/", async(req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort && { price: sort === 'asc' ? 1 : -1 }
    }

    const filter = query ? { title: { $regex: query, $options: 'i'}} : {}

    const result = await productModel.paginate(filter, options)

    /*const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: resutl.hasPrevPage,
      hasNextPage: resutl.hasNextPage,
      prevLink: resutl.hasPrevPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.prevPage}` : null,
      nextLink: resutl.hasNextPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.nextPage}` : null
      
    }*/

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error del servidor"})
  }
})


router.get("/", async (req, res) => {
  try{
    const limit = parseInt(req.query.limit)
    let products

    if(!isNaN(limit) && limit > 0) {
      products = await productManagerM.getProducts(limit)
    } else if (!isNaN(limit) && limit <= 0) {
      return res.status(400).send("La cantidad debe ser mayor a 0")
    } else {
      products = await productManagerM.getProducts()
    }

    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los productos" })
  }
})

router.get("/:pid", async (req, res) => {
  const { id } = req.params

  try {
    const product = await productManagerM.getProductsById(id)
    if(!product) {
      return res.status(404).json({ message: "Producto no encontrado"})
    }
    res.json(product)
  } catch(error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener el producto"})
  }
})

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