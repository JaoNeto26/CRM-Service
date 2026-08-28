import { Response, NextFunction } from "express";
import * as usuariosService from "../services/usuarios.service";
import { RequestAutenticada } from "../middlewares/auth";

export async function listar(_req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    res.json(await usuariosService.listar());
  } catch (err) { next(err); }
}

export async function buscarPorId(req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    res.json(await usuariosService.buscarPorId(req.params.id));
  } catch (err) { next(err); }
}

export async function atualizar(req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    res.json(await usuariosService.atualizar(req.params.id, req.usuarioId, req.body));
  } catch (err) { next(err); }
}

export async function trocarSenha(req: RequestAutenticada, res: Response, next: NextFunction) {
  try {
    await usuariosService.trocarSenha(req.params.id, req.usuarioId, req.body.senhaAtual, req.body.novaSenha);
    res.status(204).send();
  } catch (err) { next(err); }
}
