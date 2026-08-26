var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as clientesService from "../services/clientes.service";
export function listarClientes(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientes = yield clientesService.listar();
            res.json(clientes);
        }
        catch (err) {
            next(err);
        }
    });
}
export function buscarCliente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cliente = yield clientesService.buscarPorId(req.params.id);
            if (!cliente)
                return res.status(404).json({ erro: "Cliente não encontrado" });
            res.json(cliente);
        }
        catch (err) {
            next(err);
        }
    });
}
export function criarCliente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cliente = yield clientesService.criar(req.body);
            res.status(201).json(cliente);
        }
        catch (err) {
            next(err);
        }
    });
}
export function atualizarCliente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cliente = yield clientesService.atualizar(req.params.id, req.body);
            res.json(cliente);
        }
        catch (err) {
            next(err);
        }
    });
}
export function removerCliente(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield clientesService.remover(req.params.id);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    });
}
