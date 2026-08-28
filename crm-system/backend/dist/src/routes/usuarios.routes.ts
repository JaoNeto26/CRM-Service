import { Router } from "express";
import * as usuariosController from "../controllers/usuarios.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { atualizarUsuarioSchema, trocarSenhaSchema } from "../schemas/usuario.schema";
import { atualizarAgendamentoSchema, criarAgendamentoSchema } from "../schemas/agendamento.schema";

const router = Router();
router.use(autenticar);

router.get("/", usuariosController.listar as any);
router.get("/:id", validarIdParam(), usuariosController.buscarPorId as any);
router.post("/", validarBody(criarAgendamentoSchema), (usuariosController as any).criar as any);
router.put("/:id", validarIdParam(), validarBody(atualizarAgendamentoSchema), usuariosController.atualizar as any);
router.delete("/:id", validarIdParam(), (usuariosController as any).remover as any);

export default router;
