import { Router } from "express";
import handlebars from "express-handlebars";

const router = Router();
router.engine("handlebars", handlebars.engine());
router.set("views", __dirname + "/../views");
router.set("view engine", "handlebars");

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {});

});

export default router;
