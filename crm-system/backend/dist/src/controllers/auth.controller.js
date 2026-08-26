var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as authService from "../services/auth.service";
export function registrar(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nome, email, senha } = req.body;
            const usuario = yield authService.registrar(nome, email, senha);
            res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
        }
        catch (err) {
            next(err);
        }
    });
}
export function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, senha } = req.body;
            const resultado = yield authService.login(email, senha);
            res.json(resultado);
        }
        catch (err) {
            res.status(401).json({ erro: "Credenciais inválidas" });
        }
    });
}
