import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma";

export async function registrar(nome: string, email: string, senha: string) {
    const senhaHash = await bcrypt.hash(senha, 12);
    const usuario = await prisma.usuario.create({
        data: { name: nome, email, senha: senhaHash },
    });

    return { id: usuario.id, nome: usuario.name, email: usuario.email };
}

export async function login(email: string, senha: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario?.senha || !(await bcrypt.compare(senha, usuario.senha))) {
        throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET ?? "local-development-secret", {
        expiresIn: "8h",
    });

    return {
        token,
        usuario: { id: usuario.id, nome: usuario.name, email: usuario.email },
    };
}