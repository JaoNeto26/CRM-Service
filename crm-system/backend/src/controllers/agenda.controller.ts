import type { NextFunction, Request, Response } from "express";

import * as agendaService from "../services/agenda.service";

export async function listar(_req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await agendaService.listar());
    } catch (error) {
        next(error);
    }
}

export async function criar(req: Request & { usuarioId?: string }, res: Response, next: NextFunction) {
    try {
        res.status(201).json(await agendaService.criar(req.usuarioId!, req.body));
    } catch (error) {
        next(error);
    }
}

export async function buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await agendaService.buscarPorId(String(req.params.id)));
    } catch (error) {
        next(error);
    }
}

export async function atualizar(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await agendaService.atualizar(String(req.params.id), req.body));
    } catch (error) {
        next(error);
    }
}

export async function atualizarStatus(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await agendaService.atualizarStatus(String(req.params.id), req.body.status));
    } catch (error) {
        next(error);
    }
}

export async function remover(req: Request, res: Response, next: NextFunction) {
    try {
        await agendaService.deletar(String(req.params.id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}