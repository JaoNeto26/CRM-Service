var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as agendaService from "../services/agenda.service";
export function listar(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield agendaService.listar());
        }
        catch (error) {
            next(error);
        }
    });
}
export function criar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(201).json(yield agendaService.criar(req.usuarioId, req.body));
        }
        catch (error) {
            next(error);
        }
    });
}
export function buscarPorId(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield agendaService.buscarPorId(String(req.params.id)));
        }
        catch (error) {
            next(error);
        }
    });
}
export function atualizar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield agendaService.atualizar(String(req.params.id), req.body));
        }
        catch (error) {
            next(error);
        }
    });
}
export function atualizarStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.json(yield agendaService.atualizarStatus(String(req.params.id), req.body.status));
        }
        catch (error) {
            next(error);
        }
    });
}
export function remover(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield agendaService.deletar(String(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    });
}
