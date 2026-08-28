import { Router } from "express";
import * as controller from "../controllers/negociacoes.controller";
import { autenticar } from "../middlewares/auth";
import { validarBody, validarIdParam } from "../middlewares/validate";
import { criarNegociacaoSchema, atualizarNegociacaoSchema } from "../schemas/negociacao.schema";

const router = Router();
router.use(autenticar);

router.get("/", controller.listar);
router.get("/:id", validarIdParam(), controller.buscarPorId);
router.post("/", validarBody(criarNegociacaoSchema), controller.criar);
router.put("/:id", validarIdParam(), validarBody(atualizarNegociacaoSchema), controller.atualizar);
router.delete("/:id", validarIdParam(), controller.remover);

export default router;
