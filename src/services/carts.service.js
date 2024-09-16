import CartManagerMongoose from "../dao/managerMongo/cartManagerMongo.js";
import cartsModel from "../dao/models/carts.model.js";
import { findUserById } from "../services/user.service.js"
import TicketService from "./ticket.service.js";
import { v4 as uuidv4 } from "uuid";
import { sendPurchaseConfirm } from "./mail.service.js";
import mongoose from "mongoose";

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
    const cart = await cartsModel
      .findById(cid)
      .populate({
        path: "products.productId",
        model: "product",
      })
      .lean();

    console.log("Cart from service:", JSON.stringify(cart, null, 2));
    return cart;
  } catch (error) {
    console.error("Error in getCartById:", error);
    throw new Error("Error al obtener el carrito");
  }
};

export const updateCart = async (cid, updatedCart) => {
  try {
    console.log('Updating cart:', cid);
    console.log('Updated cart data:', JSON.stringify(updatedCart, null, 2));

    if (!updatedCart || !Array.isArray(updatedCart.products)) {
      throw new Error("Debe ser un arreglo de productos");
    }

    const transformedProducts = updatedCart.products.map(product => ({
      productId: product.product,
      quantity: product.quantity
    }));

    const cartToUpdate = { products: transformedProducts };

    const result = await cartManager.updateCart(cid, cartToUpdate);
    console.log('Cart updated successfully:', result);
    return result;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw new Error(`Error al actualizar el carrito: ${error.message}`);
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

export const purchaseCart = async (cid, productsFromClient) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await getCartById(cid);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    if (!Array.isArray(productsFromClient) || productsFromClient.length === 0) {
      throw new Error("No se proporcionaron productos para la compra.");
    }

    const user = await findUserById(cart.user);
    if (!user || !user.email) {
      throw new Error("Usuario no encontrado o sin email.");
    }

    console.log("Products from client:", JSON.stringify(productsFromClient, null, 2));

    const productsNotProcessed = [];
    let totalAmount = 0;
    const ticketProducts = [];

    for (let clientProduct of productsFromClient) {
      const cartProduct = cart.products.find(p => p.productId._id.toString() === clientProduct.product);
      if (!cartProduct) {
        productsNotProcessed.push({ id: clientProduct.product, reason: "No encontrado en el carrito" });
        continue;
      }

      const product = cartProduct.productId;
      if (!product) {
        productsNotProcessed.push({ id: clientProduct.product, reason: "Producto no encontrado en la base de datos" });
        continue;
      }

      if (product.stock < clientProduct.quantity) {
        productsNotProcessed.push({ id: clientProduct.product, reason: "Stock insuficiente" });
        continue;
      }

      product.stock -= clientProduct.quantity;
      await cartsModel.findOneAndUpdate(
        { _id: product._id },
        { $set: { stock: product.stock } },
        { session }
      );
      totalAmount += product.price * clientProduct.quantity;
      ticketProducts.push({
        product: product._id,
        title: product.title,
        quantity: clientProduct.quantity,
        price: product.price
      });
    }

    console.log("Total amount:", totalAmount);

    let ticket = null;
    if (totalAmount > 0 && ticketProducts.length > 0) {
      ticket = await ticketService.createTicket({
        code: uuidv4().replace(/-/g, ""),
        amount: totalAmount,
        purchaser: user.email,
        products: ticketProducts,
      }, { session });

      console.log("Ticket created:", JSON.stringify(ticket, null, 2));

      await sendPurchaseConfirm(user.email, ticket);
    }

    const updatedCartProducts = cart.products.filter((item) =>
      !productsNotProcessed.some(p => p.id === item.productId._id.toString())
    );
    await updateCart(cid, { products: updatedCartProducts });

    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Compra realizada con éxito",
      ticket,
      productsNotProcessed
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error en purchaseCart:", error);
    throw new Error(`Error al procesar la compra: ${error.message}`);
  }
};

