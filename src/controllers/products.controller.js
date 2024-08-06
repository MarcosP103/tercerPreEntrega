import {
    getRealTimeProducts,
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  } from '../services/products.service.js';
  import userService from '../dao/models/user.model.js';
  
  export const GetRealTimeProducts = async (req, res) => {
    try {
      const products = await getRealTimeProducts();
      res.render('index', { products, length: products.length > 0 });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  };
  
  export const GetProducts = async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;
      const result = await getProducts(limit, page, sort, query);
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
  
      res.render('index', { products: result.docs, prevLink, nextLink });
    } catch (error) {
      console.error("No se pudieron obtener los productos", error);
      res.status(500).json({ status: 'error', message: "No se pudieron obtener los productos" });
    }
  };
  
  export const GetProductById = async (req, res) => {
    try {
      const pId = req.params.pid;
      const userId = req.user ? req.user._id : null;
      
      const product = await getProductById(pId);
  
      if (!product) {
        return res.status(404).send({ status: "error", error: "Producto no encontrado" });
      }
  
      let cartId = null;
      if (userId) {
        const user = await userService.findOne({ _id: userId });
        cartId = user ? user.cartId : null;
      }
  
      res.render('productsDet', {
        product: {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          status: product.status,
          stock: product.stock,
          category: product.category,
          thumbnails: product.thumbnails
        },
        cartId
      });
    } catch (error) {
      console.error("No se pudo obtener el producto por ID", error);
      res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
  };
  
  
  export const AddProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  
    try {
      await addProduct(title, description, code, price, status, stock, category, thumbnails);
      res.status(201).json({ message: "Producto agregado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al agregar el producto" });
    }
  };
  
  export const UpdateProduct = async (req, res) => {
    const { id } = req.params;
    const productMod = req.body;
  
    try {
      const updatedProduct = await updateProduct(id, productMod);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      res.json({ message: "Producto modificado correctamente", product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al modificar el producto" });
    }
  };
  
  export const DeleteProduct = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteProduct(id);
      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
  };
  