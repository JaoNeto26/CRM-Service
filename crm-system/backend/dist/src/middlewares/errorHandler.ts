import { Request, Response, NextFunction } from "express";
import { ErroDominio } from "../utils/erros";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Erros de domínio conhecidos (402, 404, 403, 400, 409) — mensagem segura de expor
  if (err instanceof ErroDominio) {
    return res.status(err.status).json({ erro: err.message });
  }

  // Erro do Prisma por violação de constraint única (ex: email duplicado)
  if (err?.code === "P2002") {
    return res.status(409).json({ erro: "Já existe um registro com esses dados" });
  }

  // Qualquer outro erro é inesperado — nunca vaza detalhe interno/stack em produção
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);
  const mensagem = process.env.NODE_ENV === "production" ? "Erro interno do servidor" : err.message;
  res.status(500).json({ erro: mensagem });
}
