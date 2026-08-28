import { prisma } from "../config/database";

export async function resumoGeral() {
  const inicioHoje = new Date();
  inicioHoje.setHours(0, 0, 0, 0);
  const fimHoje = new Date();
  fimHoje.setHours(23, 59, 59, 999);

  // Roda tudo em paralelo — são consultas independentes, não há motivo pra serializar.
  // Uso groupBy/aggregate/count no banco em vez de findMany + reduce em memória,
  // que não escalaria bem conforme a base de clientes/negociações cresce.
  const [
    clientesPorStatus,
    negociacoesPorEtapa,
    valorEmAberto,
    ordensServicoPorStatus,
    agendamentosHoje,
  ] = await Promise.all([
    (prisma as any).cliente.groupBy({ by: ["status"], _count: true }),
    (prisma as any).negociacao.groupBy({ by: ["etapa"], _count: true }),
    (prisma as any).negociacao.aggregate({
      _sum: { valor: true },
      where: { etapa: { notIn: ["FECHADO_GANHO", "FECHADO_PERDIDO"] } },
    }),
    (prisma as any).ordemServico.groupBy({ by: ["status"], _count: true }),
    (prisma as any).agendamento.count({
      where: { dataHora: { gte: inicioHoje, lte: fimHoje }, status: { not: "CANCELADO" } },
    }),
  ]);

  return {
    clientesPorStatus,
    negociacoesPorEtapa,
    valorEmAbertoPipeline: valorEmAberto._sum.valor ?? 0,
    ordensServicoPorStatus,
    agendamentosHoje,
  };
}
