import {
    createCart,
    addProductToCart,
    getCartById,
    updateCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart,
  } from "../services/carts.service.js";
  
  export const createCartF = async (req, res) => {
    try {
      const newCart = await createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const addProductToCartF = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    console.log('CID:', cid);
    console.log('PID:', pid);
    console.log('Quantity:', quantity);

    try {
        const updatedCart = await addProductToCart(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  };
  
  export const getCartByIdF = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const cart = await getCartById(cid).lean()
      res.render("cartDet", { cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateCartF = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
  
    try {
      const updatedCart = await updateCart(cid, products);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateProductQuantityF = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const updatedCart = await updateProductQuantity(cid, pid, quantity);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const removeProductFromCartF = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const updatedCart = await removeProductFromCart(cid, pid);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const clearCartF = async (req, res) => {
    const { cid } = req.params;
  
    try {
      const updatedCart = await clearCart(cid);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  