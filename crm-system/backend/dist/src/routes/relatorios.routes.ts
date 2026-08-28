import { Router } from "express";
import * as controller from "../controllers/relatorios.controller";
import { autenticar } from "../middlewares/auth";

const router = Router();
router.use(autenticar);

router.get("/resumo", controller.resumoGeral);

export default router;
