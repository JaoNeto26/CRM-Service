import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";

export async function registrar(nome: string, email: string, senha: string) {
  const senhaHash = await bcrypt.hash(senha, 12); // 12 rounds, nunca guarde senha em texto puro
  return prisma.usuario.create({ data: { nome, email, senha: senhaHash } });
}

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Credenciais inválidas");

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) throw new Error("Credenciais inválidas"); // mensagem genérica de propósito

  const token = jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET!, { expiresIn: "8h" });
  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}