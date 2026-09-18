import type { NextFunction, Request, Response } from "express";

import * as relatoriosService from "../services/relatorios.service";

export async function resumoGeral(_req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await relatoriosService.resumoGeral());
    } catch (error) {
        next(error);
    }
}