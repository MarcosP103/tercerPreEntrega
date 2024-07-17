import express from "express";
import {
  handleCreateCart,
  handleAddProductToCart,
  handleGetCartById,
  handleUpdateCart,
  handleUpdateProductQuantity,
  handleRemoveProductFromCart,
  handleClearCart,
} from "../controllers/carts.controller.js";

const router = express.Router();

router.post("/", handleCreateCart);

router.post("/:cid/products/:pid", handleAddProductToCart);

router.get("/:cid", handleGetCartById);

router.put("/:cid", handleUpdateCart);

router.put("/:cid/products/:pid", handleUpdateProductQuantity);

router.delete("/:cid/products/:pid", handleRemoveProductFromCart);

router.delete("/:cid", handleClearCart);

export default router;
