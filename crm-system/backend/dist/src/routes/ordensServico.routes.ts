import { Router } from "express";
import * as controller from "../controllers/ordensServico.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { criarOrdemServicoSchema, atualizarOrdemServicoSchema } from "../schemas/ordemServico.schema";

const router = Router();
router.use(autenticar);

router.get("/", controller.listar);
router.get("/:id", validarIdParam(), controller.buscarPorId);
router.post("/", validarBody(criarOrdemServicoSchema), controller.criar);
router.put("/:id", validarIdParam(), validarBody(atualizarOrdemServicoSchema), controller.atualizar);
router.delete("/:id", validarIdParam(), controller.remover);

export default router;
