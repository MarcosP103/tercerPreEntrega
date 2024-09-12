import CartManagerMongoose from "../dao/managerMongo/cartManagerMongo.js";
import cartsModel from "../dao/models/carts.model.js";
import productModel from "../dao/models/products.model.js";
import TicketService from "./ticket.service.js";
import { v4 as uuidv4 } from "uuid";

const cartManager = new CartManagerMongoose();
const ticketService = new TicketService();

export const createCart = async () => {
  try {
    return await cartManager.createCart();
  } catch (error) {
    throw new Error("Error al crear el carrito");
  }
};

export const addProductToCart = async (cid, pid, quantity) => {
  quantity = parseInt(quantity, 10);
  if (isNaN(quantity) || quantity <= 0) {
    throw new Error("Cantidad invalida.");
  }

  try {
    console.log(
      `Adding to cart in backend: Cart ID: ${cid}, Product ID: ${pid}, Quantity: ${quantity}`
    );

    const cart = await cartManager.addProductToCart(cid, pid, quantity);
    console.log("Cart after adding product:", cart);

    if (!cart) {
      throw new Error("No se pudo agregar el producto al carrito");
    }

    return cart;
  } catch (error) {
    console.error("Error en addProductToCart:", error);
    throw new Error("Error al agregar el producto al carrito");
  }
};

export const getCartById = async (cid) => {
  try {
    const cart = await cartsModel.findById(cid).populate({
      path: "products.productId",
      model: "product"
    }).lean();
    
    console.log('Cart from service:', JSON.stringify(cart, null, 2));
    return cart;
  } catch (error) {
    console.error('Error in getCartById:', error);
    throw new Error("Error al obtener el carrito");
  }
};

export const updateCart = async (cid, products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("Debe ser un arreglo de productos");
  }
  try {
    return await cartManager.updateCart(cid, products);
  } catch (error) {
    throw new Error("Error al actualizar el carrito");
  }
};

export const updateProductQuantity = async (cid, pid, quantity) => {
  if (!quantity || quantity <= 0) {
    throw new Error("Cantidad inválida");
  }
  try {
    return await cartManager.updateProductQuantity(cid, pid, quantity);
  } catch (error) {
    throw new Error(
      "Error al actualizar la cantidad del producto en el carrito"
    );
  }
};

export const removeProductFromCart = async (cid, pid) => {
  try {
    return await cartManager.removeProductFromCart(cid, pid);
  } catch (error) {
    throw new Error("Error al eliminar el producto del carrito");
  }
};

export const clearCart = async (cid) => {
  try {
    return await cartManager.clearCart(cid);
  } catch (error) {
    throw new Error("Error al vaciar el carrito");
  }
};

export const purchaseCart = async (cid) => {
  const cart = await getCartById(cid);
  if (!cart) {
    throw new Error("Carrito no encontrado.");
  }

  const productsToPurchase = cart.products;
  const productsNotProcessed = [];
  let totalAmount = 0;

  for (let item of productsToPurchase) {
    const product = await productModel.findById(item.productId);

    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();
      totalAmount += product.price * item.quantity;
    } else {
      productsNotProcessed.push(item.productId);
    }
  }

  if (totalAmount > 0) {
    await ticketService.createTicket({
      code: uuidv4().replace(/-/g, ""),
      amount: totalAmount,
      purchaser: cart.user.email,
      products: cart.products.filter(
        (item) => !productsNotProcessed.includes(item.productId)
      ),
    });
  }

  cart.products = cart.products.filter((item) =>
    productsNotProcessed.includes(item.productId)
  );
  await updateCart(cid, cart.products);

  return productsNotProcessed;
};
