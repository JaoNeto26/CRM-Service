import { Router, RequestHandler } from "express";
import * as controller from "../controllers/relatorios.controller";
import { autenticar } from "../middlewares/auth";

const router = Router();
router.use(autenticar);

router.get("/resumo", controller.resumoGeral as unknown as RequestHandler);

export default router;
