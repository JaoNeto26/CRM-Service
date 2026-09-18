import type { NextFunction, Request, Response } from "express";

import * as authService from "../services/auth.service";

export async function registrar(req: Request, res: Response, next: NextFunction) {
    try {
        const { nome, email, senha } = req.body;
        const usuario = await authService.registrar(nome, email, senha);
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, senha } = req.body;
        res.json(await authService.login(email, senha));
    } catch (error) {
        next(error);
    }
}