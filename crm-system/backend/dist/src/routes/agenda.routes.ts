import { Router } from "express";
import * as controller from "../controllers/agenda.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { criarAgendamentoSchema, atualizarAgendamentoSchema } from "../schemas/agendamento.schema";

const router = Router();
router.use(autenticar);

router.get("/", controller.listar);
router.get("/:id", validarIdParam(), controller.buscarPorId);
router.post("/", validarBody(criarAgendamentoSchema), controller.criar);
router.put("/:id", validarIdParam(), validarBody(atualizarAgendamentoSchema), controller.atualizar);
router.delete("/:id", validarIdParam(), controller.remover);

export default router;
