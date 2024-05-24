import { Router } from 'express'
import { __dirname } from '../utils.js';
import { v4 as uuidv4 } from 'uuid'
import manager from '../dao/manager/productManager.js'
import productModel from '../dao/models/products.model.js';

const router = Router();
const productManager = new manager("../dao/manager/DB.json");

function validateType(field, expectedType) {
  return typeof field === expectedType;
}
function arrayThumb(arr) {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => typeof item === "string");
}

router.get('/realTimeProducts', async (req, res) => {
  try {
    const products = await productManager.uploadProducts()
    res.render('index', {products, length : products.length > 0 ? true : false})
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' })
  }
})

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    let products;

    if (!isNaN(limit) && limit > 0) {
      products = await productManager.getProducts(parseInt(limit));
    } else if (!isNaN(limit) && limit <= 0) {
      return res.status(400).send("La cantidad debe ser mayor a 0");
    } else {
      products = await productManager.getProducts();
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductsById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto." });
  }
});

router.post("/", async (req, res) => {
  try {
    const productId = uuidv4()

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (
      !title &&
      !description &&
      !code &&
      !price &&
      !status &&
      !stock &&
      !category
    ) {
      return res.status(404).json({ error: "Debe introducir todos los campos." });
    }

    if (
      !validateType(title, "string") &&
      !validateType(description, "string") &&
      !validateType(code, "string") &&
      !validateType(price, "number") &&
      !validateType(status, "boolean") &&
      !validateType(stock, "number") &&
      !validateType(category, "string")
    ) {
      return res.status(400).json({ error: "Los campos deben respetar el tipo." });
    }

    if (thumbnails && !arrayThumb(thumbnails)) {
      return res.status(400).json({ error: "El campo Thumbnail debe ser un array." });
    }

    if (status !== undefined && !validateType(status, "boolean")) {
      return res.status(400).json({ error: "El campo status debe ser un valor true." });
    }

    const defaultStatus = true;
    const finalStatus = status !== undefined ? status : defaultStatus;

    await productManager.addProduct(
      productId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      finalStatus
    );

    res.status(201).json({ message: "Producto agregado correctamnete." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto." });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    if (!req.body && Object.keys(req.body).length == 0) {
      return res.status(400).json({ error: "Debe proporcionar los datos correctos" });
    }

    const product = await productManager.getProductsById(productId);
    if (!product) {
      res.status(400).json({ error: "No se encontró ningún producto" });
    }

    if (req.body.id && req.body.id !== productId) {
      return res.status(400).json({ error: "No se permite modificar el ID" });
    }

    Object.assign(product, req.body);

    await productManager.addFile();

    return res.json(product);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.body.pid);

    const product = productManager.getProductsById(productId);
    if (!product) {
      return res.status(400).json({ error: "No se encontró ningún producto con ese ID" });
    }

    await productManager.delProduct(productId);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

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

export default router;