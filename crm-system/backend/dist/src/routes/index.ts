import { Router } from "express";
import clientesRoutes from "./clientes.routes";
import authRoutes from "./auth.routes";
import usuariosRoutes from "./usuarios.routes";
import negociacoesRoutes from "./negociacoes.routes";
import ordensServicoRoutes from "./ordensServico.routes";
import agendaRoutes from "./agenda.routes";
import relatoriosRoutes from "./relatorios.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/clientes", clientesRoutes);
router.use("/negociacoes", negociacoesRoutes);
router.use("/ordens-servico", ordensServicoRoutes);
router.use("/agenda", agendaRoutes);
router.use("/relatorios", relatoriosRoutes);

export default router;
