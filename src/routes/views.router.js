import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const router = Router();

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {});

});

router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page)
  if(!page) page =1
  let result = await productModel.paginate({}, { page, limit: 5, lean: true })
  result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : '';
  result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : '';
  result.isValid = !(page <= 0 || page > result.totalPages)
  res.render('product', result)
})

export default router;
