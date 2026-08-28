import { Request, Response, NextFunction } from "express";
import * as clientesService from "../services/clientes.service";

export async function listarClientes(_req: Request, res: Response, next: NextFunction) {
  try {
    const clientes = await clientesService.listar();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

export async function buscarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const cliente = await clientesService.buscarPorId(req.params.id);
    if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function criarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const cliente = await clientesService.criar(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function atualizarCliente(req: Request, res: Response, next: NextFunction) {
  try {
    const cliente = await clientesService.atualizar(req.params.id, req.body);
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

export async function removerCliente(req: Request, res: Response, next: NextFunction) {
  try {
    await clientesService.remover(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
