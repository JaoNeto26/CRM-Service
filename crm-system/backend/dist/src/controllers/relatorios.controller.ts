import { Response, NextFunction } from "express";
import * as relatoriosService from "../services/relatorios.service";
import { RequestAutenticada } from "../middlewares/auth";

export async function resumoGeral(_req: RequestAutenticada, res: Response, next: NextFunction) {
  try { res.json(await relatoriosService.resumoGeral()); } catch (err) { next(err); }
}
