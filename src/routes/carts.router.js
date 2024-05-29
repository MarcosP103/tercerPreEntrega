import express from "express";
import CartManagerMongoose from "../dao/managerMongo/cartManagerMongo.js";
import cartsModel from "../dao/models/carts.model.js";

const router = express.Router();
const cartManager = new CartManagerMongoose();

//MongoDB
router.get("/", async (req, res) => {
  try {
    let carts = await cartsModel.find();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ result: "error", message: "Error al cargar el carrito" });
  }
});

router.post("/", async (req, res) => {
  let { id, products_id } = req.body;
  if (!id || !products_id) {
    res.send({ status: "error", error: "Faltan parametros" });
  }
  let result = await cartsModel.create({ id, products_id });
  res.send({ result: "success", payload: result });
});

router.put("/:uid", async (req, res) => {
  let { uid } = req.params;
  let cartToReplace = req.body;

  if (!cartToReplace.id || !cartToReplace.products_id) {
    res.send({ status: "error", error: "Parametros no definidos" });
  }

  let result = await cartsModel.updateOne({ _id: uid }, cartToReplace);

  res.send({ result: "success", payload: result });
});

router.delete("/:uid", async (req, res) => {
  let { uid } = req.params;
  let result = await cartsModel.deleteOne({ _id: uid });
  res.send({ result: "success", payload: result });
});

//con CartManager
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad invalida" });
  }

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
    if (!updatedCart) {
      return res
        .status(400)
        .json({ error: "Carrito o producto no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartsModel.findById(cid).populate('products.productId').lean()
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el carrito " });
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Debe ser un arraeglo de productos" });
  }

  try {
    const updatedCart = await cartManager.updateCart(cid, products);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Cantidad invalida" });
  }

  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error: "Error al actualizar la cantidad del producto en el carrito",
      });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const updatedCart = await cartManager.clearCart(cid);
    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

export default router;
