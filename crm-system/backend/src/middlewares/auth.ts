import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ erro: "Não autenticado" });

  try {
    const payload = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET!);
    (req as any).usuarioId = (payload as any).sub;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}