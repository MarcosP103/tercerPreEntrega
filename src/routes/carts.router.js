import express from "express";
import {
    CreateCart,
    AddProductToCart,
    GetCartById,
    UpdateCart,
    UpdateProductQuantity,
    RemoveProductFromCart,
    ClearCart,
} from "../controllers/carts.controller.js";
import { purchaseCart } from "../services/carts.service.js";

const router = express.Router();

router.post("/", CreateCart);

router.post("/:cid/products/:pid", AddProductToCart);

router.get("/:cid", GetCartById);

router.put("/:cid", UpdateCart);
router.put("/:cid/products/:pid", UpdateProductQuantity);

router.delete("/:cid/products/:pid", RemoveProductFromCart);

router.delete("/:cid", ClearCart);

router.post("/:cid/purchase", async (req, res) => {
    const { cid } = req.params

    try {
        const productsNotProcessed = await purchaseCart(cid)
        res.status(200).json({ message: "Compra realizada con exito", productsNotProcessed})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router;

