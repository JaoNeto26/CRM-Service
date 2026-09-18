import prisma from "../lib/prisma";

const STATUS_VALIDOS = new Set([
    "scheduled",
    "waiting",
    "completed",
    "cancelled",
]);

function serializar(agendamento: Awaited<ReturnType<typeof prisma.appointment.findUnique>>) {
    if (!agendamento) return null;
    return {
        id: agendamento.id,
        titulo: agendamento.title ?? "Agendamento",
        descricao: agendamento.description,
        dataHora: agendamento.startAt,
        duracaoMinutos: agendamento.durationMinutes ?? Math.max(
            1,
            Math.round((agendamento.endAt.getTime() - agendamento.startAt.getTime()) / 60000),
        ),
        status: String(agendamento.status),
    };
}

export async function listar() {
    const agendamentos = await prisma.appointment.findMany({
        include: { customer: { select: { id: true, name: true } } },
        orderBy: { startAt: "asc" },
    });

    return agendamentos.map(agendamento => ({
        ...serializar(agendamento),
        cliente: agendamento.customer
            ? { id: agendamento.customer.id, nome: agendamento.customer.name }
            : undefined,
    }));
}

export async function criar(
    usuarioId: string,
    dados: { titulo: string; descricao?: string; dataHora: string; duracaoMinutos?: number },
) {
    const duracaoMinutos = dados.duracaoMinutos ?? 30;
    const inicio = new Date(dados.dataHora);
    const fim = new Date(inicio.getTime() + duracaoMinutos * 60_000);

    if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) {
        throw Object.assign(new Error("A data e hora devem estar no futuro"), { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: { company: true },
    });
    if (!usuario) throw Object.assign(new Error("Usuário não encontrado"), { status: 404 });

    const company = usuario.company ?? await prisma.company.create({
        data: { userId: usuario.id, name: `Agenda de ${usuario.name}` },
    });

    const clienteSemCadastro = await prisma.customer.upsert({
        where: { companyId_googleId: { companyId: company.id, googleId: "agenda-sem-cliente" } },
        update: {},
        create: {
            companyId: company.id,
            name: "Sem cliente",
            email: `sem-cliente-${company.id}@local.invalid`,
            googleId: "agenda-sem-cliente",
        },
    });

    const agendamento = await prisma.appointment.create({
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
}

export async function atualizarStatus(agendamentoId: string, status: string) {
    const statusNormalizado = status.toLowerCase();
    if (!STATUS_VALIDOS.has(statusNormalizado)) {
        throw Object.assign(new Error("Status de agendamento inválido"), { status: 400 });
    }
    const agendamento = await prisma.appointment.update({
        where: { id: agendamentoId },
        data: { status: statusNormalizado as never },
    });
    return serializar(agendamento);
}

export async function atualizar(agendamentoId: string, dados: { titulo?: string; descricao?: string; dataHora?: string; duracaoMinutos?: number }) {
    const atualizacao: any = {};
    if (dados.titulo !== undefined) atualizacao.title = dados.titulo;
    if (dados.descricao !== undefined) atualizacao.description = dados.descricao;
    if (dados.dataHora !== undefined) {
        const inicio = new Date(dados.dataHora);
        if (Number.isNaN(inicio.getTime()) || inicio <= new Date()) {
            throw Object.assign(new Error("A data e hora devem estar no futuro"), { status: 400 });
        }
        atualizacao.startAt = inicio;
        if (dados.duracaoMinutos !== undefined) {
            atualizacao.durationMinutes = dados.duracaoMinutos;
            atualizacao.endAt = new Date(inicio.getTime() + dados.duracaoMinutos * 60_000);
        }
    } else if (dados.duracaoMinutos !== undefined) {
        const agendamentoAtual = await prisma.appointment.findUnique({ where: { id: agendamentoId } });
        if (!agendamentoAtual) throw Object.assign(new Error("Agendamento não encontrado"), { status: 404 });
        atualizacao.durationMinutes = dados.duracaoMinutos;
        atualizacao.endAt = new Date(agendamentoAtual.startAt.getTime() + dados.duracaoMinutos * 60_000);
    }
    const agendamento = await prisma.appointment.update({
        where: { id: agendamentoId },
        data: atualizacao,
    });
    return serializar(agendamento);
}

export async function deletar(agendamentoId: string) {
    await prisma.appointment.delete({ where: { id: agendamentoId } });
}


export async function buscarPorId(agendamentoId: string) {
    const agendamento = await prisma.appointment.findUnique({
        where: { id: agendamentoId },
        include: { customer: { select: { id: true, name: true } } },
    });
    if (!agendamento) {
        throw Object.assign(new Error("Agendamento não encontrado"), { status: 404 });
    }
    return {
        ...serializar(agendamento),
        cliente: agendamento.customer
            ? { id: agendamento.customer.id, nome: agendamento.customer.name }
            : undefined,
    };
}