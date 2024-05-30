import {Router} from "express"

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error("No se pudo mostrar la pagina", error);
    }
})

export default router;