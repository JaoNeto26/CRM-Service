import { Router } from "express";
import * as usuariosController from "../controllers/usuarios.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { atualizarUsuarioSchema, trocarSenhaSchema } from "../schemas/usuario.schema";

const router = Router();
router.use(autenticar);

router.get("/", usuariosController.listar);
router.get("/:id", validarIdParam(), usuariosController.buscarPorId);
router.put("/:id", validarIdParam(), validarBody(atualizarUsuarioSchema), usuariosController.atualizar);
router.put("/:id/senha", validarIdParam(), validarBody(trocarSenhaSchema), usuariosController.trocarSenha);

export default router;
