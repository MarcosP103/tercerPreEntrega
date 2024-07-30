import express from "express";
import { loggerTestR, testLogger } from "../../controllers/loggerW.controller.js";

const router = express.Router();

router.get("/", loggerTestR)
router.post("/", testLogger);

export default router;
