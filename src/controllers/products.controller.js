import {
  getRealTimeProducts,
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products.service.js";
import userService from "../dao/models/user.model.js";

export const GetRealTimeProducts = async (req, res) => {
  try {
    const products = await getRealTimeProducts();
    res.render("index", { products, length: products.length > 0 });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

export const GetProducts = async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await getProducts(limit, page, sort, query);
    const {
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
    } = result;
    const prevLink = hasPrevPage
      ? `${req.baseUrl}/get?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
      : null;
    const nextLink = hasNextPage
      ? `${req.baseUrl}/get?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
      : null;

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

    console.log("User Role:", req.user ? req.user.role : "No User");

    const user = req.user ? { ...req.user._doc } : null;
    res.render("index", { user, products: result.docs, prevLink, nextLink });
  } catch (error) {
    console.error("No se pudieron obtener los productos", error);
    res
      .status(500)
      .json({
        status: "error",
        message: "No se pudieron obtener los productos",
      });
  }
};

export const GetProductById = async (req, res) => {
  try {
    const pid = req.params.pid;
    console.log("ID recibido para buscar el producto:", pid);
    const userId = req.user ? req.user._id : null;

    const product = await getProductById(pid);

    if (!product) {
      return res
        .status(404)
        .send({ status: "error", error: "Producto no encontrado" });
    }

    let cartId = null;
    if (req.user) {
      const user = await userService.findOne({ _id: req.user._id });
      cartId = user ? user.cartId : null;
    }

    res.render("productsDet", {
      product: {
        _id: product._id,
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails,
      },
      cartId,
    });
  } catch (error) {
    console.error("No se pudo obtener el producto por ID", error);
    res
      .status(500)
      .send({ status: "error", error: "Error interno del servidor" });
  }
};

export const RenderAddProduct = (req, res) => {
  const userEmail = req.user.email;
  console.log("Entrando render");
  try {
    console.log("Intentando renderizar");
    res.render("addProducts", { userEmail });
  } catch (error) {
    console.error("Error al renderizar la vista para agregar producto:", error);
    res.status(500).send("Error al renderizar la vista para agregar producto");
  }
};

export const AddProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
    owner,
    testProduct,
  } = req.body;
  try {
    const newProduct = await addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
      owner,
      testProduct
    );
    res
      .status(201)
      .json({
        message: "Producto agregado correctamente",
        product: newProduct,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};

export const RenderEditProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).send("ID de producto no proporcionado");
    }

    const product = await getProductById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("upProducts", { product });
  } catch (error) {
    res.status(500).send("Error al cargar el producto para editar");
  }
};

export const UpdateProduct = async (req, res) => {
  const { pid } = req.params;
  const productMod = req.body;

  try {
    const updatedProduct = await updateProduct(pid, productMod);
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json({ status: "success", message: "Producto modificado correctamente", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al modificar el producto" });
  }
};

export const RenderDeleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).send("ID de producto no proporcionado");
    }

    const product = await getProductById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    
    res.render("delProducts", { product });
  } catch (error) {
    res.status(500).send("Error al cargar el producto para eliminar");
  }
};

export const DeleteProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const productDeleted = await deleteProduct(pid);
    if(!productDeleted){
      return res.status(404).json({ message: "Producto no encontrado" })
    }
    return res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente', product: productDeleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
