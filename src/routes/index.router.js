import {Router} from "express"
import productModel from "../dao/models/products.model.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render('products', { 
            products,
            userName: req.user ? req.user.first_name : 'Invitado'
        });
    } catch (error) {
        res.status(500).send("Error al obtener los productos")
    }
})

export default router;