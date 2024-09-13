import express from "express";
import {
    createCartF,
    addProductToCartF,
    getCartByIdF,
    updateCartF,
    updateProductQuantityF,
    removeProductFromCartF,
    clearCartF,
    purchaseF
} from "../controllers/carts.controller.js";
import { purchaseCart } from "../services/carts.service.js";

const router = express.Router();

router.post("/", createCartF);

router.post("/:cid/products/:pid", (req, res, next) => {console.log(`POST /api/carts/${req.params.cid}/products/${req.params.pid}`);
    next();
}, addProductToCartF);

router.get("/:cid", getCartByIdF);

router.put("/:cid", updateCartF);
router.put("/:cid/products/:pid", updateProductQuantityF);

router.delete("/:cid/products/:pid", removeProductFromCartF);

router.delete("/:cid", clearCartF);

router.post("/:cid/purchase", purchaseF)

export default router;

