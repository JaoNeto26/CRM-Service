import { prisma } from "../config/database";

export async function resumoGeral() {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date();
    fimHoje.setHours(23, 59, 59, 999);

    const [clientesPorStatus, agendamentosHoje] = await Promise.all([
        prisma.customer.groupBy({
            by: ["active"],
            _count: true,
        }),
        prisma.appointment.count({
            where: { startAt: { gte: inicioHoje, lte: fimHoje } },
        }),
    ]);

    return {
        clientesPorStatus: clientesPorStatus.map(grupo => ({
            status: grupo.active ? "Ativos" : "Inativos",
            _count: grupo._count,
        })),
        negociacoesPorEtapa: [],
        valorEmAbertoPipeline: 0,
        ordensServicoPorStatus: [],
        agendamentosHoje,
    };
}