import { Router } from "express";
import * as controller from "../controllers/agenda.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { criarAgendamentoSchema, atualizarAgendamentoSchema } from "../schemas/agendamento.schema";

const router = Router();
router.use(autenticar);

router.get("/", controller.listar as any);
router.get("/:id", validarIdParam(), controller.buscarPorId as any);
router.post("/", validarBody(criarAgendamentoSchema), controller.criar as any);
router.put("/:id", validarIdParam(), validarBody(atualizarAgendamentoSchema), controller.atualizar as any);
router.delete("/:id", validarIdParam(), controller.remover as any);

export default router;
