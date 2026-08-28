import { Router } from "express";
import {
  listarClientes,
  buscarCliente,
  criarCliente,
  atualizarCliente,
  removerCliente,
} from "../controllers/clientes.controller";
import { autenticar } from "../middlewares/auth";
import { validarIdParam } from "../middlewares/validate";

const router = Router();
router.use(autenticar);

router.get("/", listarClientes);
router.get("/:id", validarIdParam(), buscarCliente);
router.post("/", criarCliente);
router.put("/:id", validarIdParam(), atualizarCliente);
router.delete("/:id", validarIdParam(), removerCliente);

export default router;
