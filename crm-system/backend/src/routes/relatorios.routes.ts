import { Router } from "express";

import { autenticar } from "../middlewares/auth";
import { resumoGeral } from "../controllers/relatorios.controller";

const router = Router();

router.use(autenticar);
router.get("/resumo", resumoGeral);

export default router;