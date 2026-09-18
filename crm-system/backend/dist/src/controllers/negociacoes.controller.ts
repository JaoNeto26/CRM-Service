import { Response, NextFunction } from "express";
import * as negociacoesService from "../services/negociacoes.service";
import { RequestAutenticada } from "../middlewares/auth";

export async function listar(_req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await negociacoesService.listar()); } catch (err) { next(err); }
}

export async function buscarPorId(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await negociacoesService.buscarPorId(req.params.id)); } catch (err) { next(err); }
}

export async function criar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.status(201).json(await negociacoesService.criar(req.body)); } catch (err) { next(err); }
}

export async function atualizar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await negociacoesService.atualizar(req.params.id, req.body)); } catch (err) { next(err); }
}

export async function remover(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { await negociacoesService.remover(req.params.id); res.status(204).send(); } catch (err) { next(err); }
}
