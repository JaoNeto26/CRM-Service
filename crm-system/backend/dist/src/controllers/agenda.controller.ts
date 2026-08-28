import { Response, NextFunction } from "express";
import * as agendaService from "../services/agenda.service";
import { RequestAutenticada } from "../middlewares/auth";

export async function listar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    // ?minhaAgenda=true filtra só os compromissos do usuário logado
    const responsavelId = req.query.minhaAgenda === "true" ? req.usuarioId : undefined;
    res.json(await agendaService.listar(responsavelId));
  } catch (err) { next(err); }
}

export async function buscarPorId(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await agendaService.buscarPorId(req.params.id)); } catch (err) { next(err); }
}

export async function criar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.status(201).json(await agendaService.criar(req.usuarioId, req.body)); } catch (err) { next(err); }
}

export async function atualizar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await agendaService.atualizar(req.params.id, req.usuarioId, req.body)); } catch (err) { next(err); }
}

export async function remover(req: RequestAutenticada, res: Response, next: NextFunction) {
  try { await agendaService.remover(req.params.id, req.usuarioId); res.status(204).send(); } catch (err) { next(err); }
}
