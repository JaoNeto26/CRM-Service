import { prisma } from "../config/database";
import { NaoEncontrado } from "../utils/erros";

const ETAPAS_FINAIS = ["FECHADO_GANHO", "FECHADO_PERDIDO"];

export function listar() {
  return (prisma as any).negociacao.findMany({
    include: { cliente: { select: { id: true, nome: true } } },
    orderBy: { criadoEm: "desc" },
  });
}

export async function buscarPorId(id: string) {
  const negociacao = await (prisma as any).negociacao.findUnique({
    where: { id },
    include: { cliente: { select: { id: true, nome: true } } },
  });
  if (!negociacao) throw new NaoEncontrado("Negociação");
  return negociacao;
}

export async function criar(dados: { titulo: string; valor: number; clienteId: string; etapa?: string }) {
  // Verifica se o cliente existe ANTES de tentar criar — se deixasse pro Prisma
  // estourar a foreign key constraint, o erro seria genérico (500) em vez de um 404 claro.
  const cliente = await (prisma as any).cliente.findUnique({ where: { id: dados.clienteId } });
  if (!cliente) throw new NaoEncontrado("Cliente");

  return (prisma as any).negociacao.create({ data: dados as any });
}

export async function atualizar(id: string, dados: { titulo?: string; valor?: number; etapa?: string }) {
  const negociacao = await (prisma as any).negociacao.findUnique({ where: { id } });
  if (!negociacao) throw new NaoEncontrado("Negociação");

  // Regra de negócio: ao entrar numa etapa final, registra o fechamento automaticamente;
  // se voltar de uma etapa final pra uma etapa aberta (reabertura), limpa o fechadoEm.
  const fechadoEm = dados.etapa
    ? ETAPAS_FINAIS.includes(dados.etapa)
      ? new Date()
      : null
    : undefined;

  return (prisma as any).negociacao.update({
    where: { id },
    data: { ...dados, ...(fechadoEm !== undefined ? { fechadoEm } : {}) } as any,
  });
}

export async function remover(id: string) {
  const negociacao = await (prisma as any).negociacao.findUnique({ where: { id } });
  if (!negociacao) throw new NaoEncontrado("Negociação");
  await (prisma as any).negociacao.delete({ where: { id } });
}
