import { Router } from "express";
import * as controller from "../controllers/ordensServico.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { criarOrdemServicoSchema, atualizarOrdemServicoSchema } from "../schemas/ordemServico.schema";
import { atualizarAgendamentoSchema } from "../schemas/agendamento.schema";

const router = Router();
router.use(autenticar);

router.get("/", controller.listar as any);
router.get("/:id", validarIdParam(), controller.buscarPorId as any);
router.post("/", validarBody(criarOrdemServicoSchema), controller.criar as any);
router.put("/:id", validarIdParam(), validarBody(atualizarOrdemServicoSchema), controller.atualizar as any);
router.delete("/:id", validarIdParam(), controller.remover as any);

export default router;
