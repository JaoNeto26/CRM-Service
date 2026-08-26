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
import { prisma } from "../config/database";
export function registrar(nome, email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const senhaHash = yield bcrypt.hash(senha, 12); // 12 rounds, nunca guarde senha em texto puro
        return prisma.usuario.create({ data: { nome, email, senha: senhaHash } });
    });
}
export function login(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const usuario = yield prisma.usuario.findUnique({ where: { email } });
        if (!usuario)
            throw new Error("Credenciais inválidas");
        const senhaValida = yield bcrypt.compare(senha, usuario.senha);
        if (!senhaValida)
            throw new Error("Credenciais inválidas"); // mensagem genérica de propósito
        const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
    });
}
