var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from "../config/database";
export function resumoGeral() {
    return __awaiter(this, void 0, void 0, function* () {
        const inicioHoje = new Date();
        inicioHoje.setHours(0, 0, 0, 0);
        const fimHoje = new Date();
        fimHoje.setHours(23, 59, 59, 999);
        const [clientesPorStatus, agendamentosHoje] = yield Promise.all([
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
    });
}
