/**
 * Formato REAL de GET /api/relatorios/resumo, conferido contra
 * backend services/relatorios.service.ts (resumoGeral).
 * O Prisma groupBy devolve arrays de { <campo>, _count }, nao objetos.
 */
export interface GrupoContagem<T extends string = string> {
    _count: number;
    status?: T;
    etapa?: T;
}

export interface RelatorioResumo {
    clientesPorStatus: Array<{ status: string; _count: number }>;
    negociacoesPorEtapa: Array<{ etapa: string; _count: number }>;
    valorEmAbertoPipeline: number | string;
    ordensServicoPorStatus: Array<{ status: string; _count: number }>;
    agendamentosHoje: number;
}
