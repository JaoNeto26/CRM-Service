var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../lib/prisma";
const STATUS_VALIDOS = new Set([
    "scheduled",
    "waiting",
    "completed",
    "cancelled",
]);
function serializar(agendamento) {
    var _a, _b;
    if (!agendamento)
        return null;
    return {
        id: agendamento.id,
        titulo: (_a = agendamento.title) !== null && _a !== void 0 ? _a : "Agendamento",
        descricao: agendamento.description,
        dataHora: agendamento.startAt,
        duracaoMinutos: (_b = agendamento.durationMinutes) !== null && _b !== void 0 ? _b : Math.max(1, Math.round((agendamento.endAt.getTime() - agendamento.startAt.getTime()) / 60000)),
        status: String(agendamento.status),
    };
}
export function listar() {
    return __awaiter(this, void 0, void 0, function* () {
        const agendamentos = yield prisma.appointment.findMany({
            include: { customer: { select: { id: true, name: true } } },
            orderBy: { startAt: "asc" },
        });
        return agendamentos.map(agendamento => (Object.assign(Object.assign({}, serializar(agendamento)), { cliente: agendamento.customer
                ? { id: agendamento.customer.id, nome: agendamento.customer.name }
                : undefined })));
    });
}
export function criar(usuarioId, dados) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const duracaoMinutos = (_a = dados.duracaoMinutos) !== null && _a !== void 0 ? _a : 30;
        const inicio = new Date(dados.dataHora);
        const fim = new Date(inicio.getTime() + duracaoMinutos * 60000);
        if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) {
            throw Object.assign(new Error("A data e hora devem estar no futuro"), { status: 400 });
        }
        const usuario = yield prisma.usuario.findUnique({
            where: { id: usuarioId },
            include: { company: true },
        });
        if (!usuario)
            throw Object.assign(new Error("Usuário não encontrado"), { status: 404 });
        const company = (_b = usuario.company) !== null && _b !== void 0 ? _b : yield prisma.company.create({
            data: { userId: usuario.id, name: `Agenda de ${usuario.name}` },
        });
        const clienteSemCadastro = yield prisma.customer.upsert({
            where: { companyId_googleId: { companyId: company.id, googleId: "agenda-sem-cliente" } },
            update: {},
            create: {
                companyId: company.id,
                name: "Sem cliente",
                email: `sem-cliente-${company.id}@local.invalid`,
                googleId: "agenda-sem-cliente",
            },
        });
        const agendamento = yield prisma.appointment.create({
            data: {
                companyId: company.id,
                customerId: clienteSemCadastro.id,
                title: dados.titulo,
                description: dados.descricao,
                durationMinutes: duracaoMinutos,
                startAt: inicio,
                endAt: fim,
            },
        });
        return {
            id: agendamento.id,
            titulo: agendamento.title,
            descricao: agendamento.description,
            dataHora: agendamento.startAt,
            duracaoMinutos: agendamento.durationMinutes,
            status: String(agendamento.status),
        };
    });
}
export function atualizarStatus(agendamentoId, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const statusNormalizado = status.toLowerCase();
        if (!STATUS_VALIDOS.has(statusNormalizado)) {
            throw Object.assign(new Error("Status de agendamento inválido"), { status: 400 });
        }
        const agendamento = yield prisma.appointment.update({
            where: { id: agendamentoId },
            data: { status: statusNormalizado },
        });
        return serializar(agendamento);
    });
}
export function atualizar(agendamentoId, dados) {
    return __awaiter(this, void 0, void 0, function* () {
        const atualizacao = {};
        if (dados.titulo !== undefined)
            atualizacao.title = dados.titulo;
        if (dados.descricao !== undefined)
            atualizacao.description = dados.descricao;
        if (dados.dataHora !== undefined) {
            const inicio = new Date(dados.dataHora);
            if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) {
                throw Object.assign(new Error("A data e hora devem estar no futuro"), { status: 400 });
            }
            atualizacao.startAt = inicio;
            if (dados.duracaoMinutos !== undefined) {
                atualizacao.durationMinutes = dados.duracaoMinutos;
                atualizacao.endAt = new Date(inicio.getTime() + dados.duracaoMinutos * 60000);
            }
        }
        else if (dados.duracaoMinutos !== undefined) {
            const agendamentoAtual = yield prisma.appointment.findUnique({ where: { id: agendamentoId } });
            if (!agendamentoAtual)
                throw Object.assign(new Error("Agendamento não encontrado"), { status: 404 });
            atualizacao.durationMinutes = dados.duracaoMinutos;
            atualizacao.endAt = new Date(agendamentoAtual.startAt.getTime() + dados.duracaoMinutos * 60000);
        }
        const agendamento = yield prisma.appointment.update({
            where: { id: agendamentoId },
            data: atualizacao,
        });
        return serializar(agendamento);
    });
}
export function deletar(agendamentoId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.appointment.delete({ where: { id: agendamentoId } });
    });
}
export function buscarPorId(agendamentoId) {
    return __awaiter(this, void 0, void 0, function* () {
        const agendamento = yield prisma.appointment.findUnique({
            where: { id: agendamentoId },
            include: { customer: { select: { id: true, name: true } } },
        });
        if (!agendamento) {
            throw Object.assign(new Error("Agendamento não encontrado"), { status: 404 });
        }
        return Object.assign(Object.assign({}, serializar(agendamento)), { cliente: agendamento.customer
                ? { id: agendamento.customer.id, nome: agendamento.customer.name }
                : undefined });
    });
}
