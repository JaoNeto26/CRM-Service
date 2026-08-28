import { prisma } from "../config/database";

export function listar() {
  return (prisma as any).cliente.findMany({ include: { negociacoes: true } });
}

export function buscarPorId(id: string) {
  return (prisma as any).cliente.findUnique({ where: { id }, include: { negociacoes: true } });
}

export function criar(dados: { nome: string; email?: string; telefone?: string; empresa?: string }) {
  return (prisma as any).cliente.create({ data: dados });
}

export function atualizar(id: string, dados: Partial<{ nome: string; email?: string; telefone?: string; empresa?: string; status: string }>) {
  return (prisma as any).cliente.update({ where: { id }, data: dados as any });
}

export function remover(id: string) {
  return (prisma as any).cliente.delete({ where: { id } });
}
