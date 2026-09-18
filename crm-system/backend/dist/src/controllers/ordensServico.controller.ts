import { Response, NextFunction } from "express";
import * as ordensServicoService from "../services/ordensServico.service";
import { RequestAutenticada } from "../middlewares/auth";

export async function listar(_req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await ordensServicoService.listar()); } catch (err) { next(err); }
}

export async function buscarPorId(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await ordensServicoService.buscarPorId(req.params.id)); } catch (err) { next(err); }
}

export async function criar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.status(201).json(await ordensServicoService.criar(req.usuarioId, req.body)); } catch (err) { next(err); }
}

export async function atualizar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await ordensServicoService.atualizar(req.params.id, req.usuarioId, req.body)); } catch (err) { next(err); }
}

export async function remover(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { await ordensServicoService.remover(req.params.id, req.usuarioId); res.status(204).send(); } catch (err) { next(err); }
}
