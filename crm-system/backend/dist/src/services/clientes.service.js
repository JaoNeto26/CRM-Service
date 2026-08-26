import { prisma } from "../config/database";
export function listar() {
    return prisma.cliente.findMany({ include: { negociacoes: true } });
}
export function buscarPorId(id) {
    return prisma.cliente.findUnique({ where: { id }, include: { negociacoes: true } });
}
export function criar(dados) {
    return prisma.cliente.create({ data: dados });
}
export function atualizar(id, dados) {
    return prisma.cliente.update({ where: { id }, data: dados });
}
export function remover(id) {
    return prisma.cliente.delete({ where: { id } });
}
