import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Estende o Request do Express de forma global, então qualquer controller
// que usar (req as RequestAutenticada) tem o tipo certo do usuarioId.
export interface RequestAutenticada extends Request {
  usuarioId: string;
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Não autenticado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as RequestAutenticada).usuarioId = (payload as any).sub;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
