var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
export function registrar(nome, email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const senhaHash = yield bcrypt.hash(senha, 12);
        const usuario = yield prisma.usuario.create({
            data: { name: nome, email, senha: senhaHash },
        });
        return { id: usuario.id, nome: usuario.name, email: usuario.email };
    });
}
export function login(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const usuario = yield prisma.usuario.findUnique({ where: { email } });
        if (!(usuario === null || usuario === void 0 ? void 0 : usuario.senha) || !(yield bcrypt.compare(senha, usuario.senha))) {
            throw new Error("Credenciais inválidas");
        }
        const token = jwt.sign({ sub: usuario.id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "local-development-secret", {
            expiresIn: "8h",
        });
        return {
            token,
            usuario: { id: usuario.id, nome: usuario.name, email: usuario.email },
        };
    });
}
