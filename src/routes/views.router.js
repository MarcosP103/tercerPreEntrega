import { Router } from "express"
import handlebars from "express-handlebars"
import path from "path"

const router = Router()

router.engine("handlebars", handlebars())
router.set("views", path.join(__dirname, "../views"))
router.set("view engine", "handlebars")


router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default router