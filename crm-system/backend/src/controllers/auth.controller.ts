import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export async function registrar(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome, email, senha } = req.body;
    const usuario = await authService.registrar(nome, email, senha);
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, senha } = req.body;
    const resultado = await authService.login(email, senha);
    res.json(resultado);
  } catch (err) {
    res.status(401).json({ erro: "Credenciais inválidas" });
  }
}