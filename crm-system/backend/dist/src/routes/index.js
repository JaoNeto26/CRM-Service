import { Router } from "express";
import clientesRoutes from "./clientes.routes";
const router = Router();
router.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
router.use("/clientes", clientesRoutes);
export default router;
