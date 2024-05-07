import { fileURLToPath } from "url";
import { dirname } from "path";
import { Router } from "express";
import handlebars from "express-handlebars";
import path from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router();

router.engine("handlebars", handlebars({
    layoutsDir: path.join(__dirname, "../views/layouts"), 
    defaultLayout: 'main', 
    extname: 'handlebars'
  })
);
router.set("views", path.join(__dirname, "../views"));
router.set("view engine", "handlebars");

router.get("/realTimeProducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
