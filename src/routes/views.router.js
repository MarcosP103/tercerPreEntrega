import { Router } from "express";

const router = Router();

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {});

});

export default router;
