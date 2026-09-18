import { prisma } from "../config/database";
import { NaoEncontrado, NaoAutorizado, ConflitoDeDados } from "../utils/erros";

export function listar(responsavelId?: string) {
  return (prisma as any).agendamento.findMany({
    where: responsavelId ? { responsavelId } : undefined,
    include: {
      cliente: { select: { id: true, nome: true } },
      responsavel: { select: { id: true, nome: true } },
    },
    orderBy: { dataHora: "asc" },
  });
}

export async function buscarPorId(id: string) {
  const agendamento = await (prisma as any).agendamento.findUnique({
    where: { id },
    include: {
      cliente: { select: { id: true, nome: true } },
      responsavel: { select: { id: true, nome: true } },
    },
  });
  if (!agendamento) throw new NaoEncontrado("Agendamento");
  return agendamento;
}

// Verifica se já existe outro agendamento do mesmo responsável cujo intervalo
// [dataHora, dataHora + duração] cruza com o novo. isso pra não deixar
// a mesma pessoa com dois compromissos marcados ao mesmo tempo.
async function existeConflito(responsavelId: string, inicio: Date, duracaoMinutos: number, ignorarId?: string) {
  const fim = new Date(inicio.getTime() + duracaoMinutos * 60_000);

  type Candidate = { id: string; dataHora: Date; duracaoMinutos: number };
  const candidatos = await (prisma as any).agendamento.findMany({
    where: {
      responsavelId,
      status: { notIn: ["CANCELADO"] },
      id: ignorarId ? { not: ignorarId } : undefined,
    },
    select: { id: true, dataHora: true, duracaoMinutos: true },
  }) as Candidate[];

  return candidatos.some((c: Candidate) => {
    const cInicio = c.dataHora.getTime();
    const cFim = cInicio + c.duracaoMinutos * 60_000;
    return inicio.getTime() < cFim && fim.getTime() > cInicio; // sobreposição de intervalos
  });
}

export async function criar(
  solicitanteId: string,
  dados: { titulo: string; descricao?: string; dataHora: Date; duracaoMinutos?: number; clienteId?: string; responsavelId?: string }
) {
  const responsavelId = dados.responsavelId ?? solicitanteId;
  const duracao = dados.duracaoMinutos ?? 30;

  const responsavel = await (prisma as any).usuario.findUnique({ where: { id: responsavelId } });
  if (!responsavel) throw new NaoEncontrado("Usuário responsável");

  if (dados.clienteId) {
    const cliente = await (prisma as any).cliente.findUnique({ where: { id: dados.clienteId } });
    if (!cliente) throw new NaoEncontrado("Cliente");
  }

  if (await existeConflito(responsavelId, dados.dataHora, duracao)) {
    throw new ConflitoDeDados("Já existe um agendamento nesse horário para este responsável");
  }

  return (prisma as any).agendamento.create({
    data: { ...dados, responsavelId, duracaoMinutos: duracao } as any,
  });
}

export async function atualizar(
  id: string,
  solicitanteId: string,
  dados: { titulo?: string; descricao?: string; dataHora?: Date; duracaoMinutos?: number; status?: string }
) {
  const agendamento = await (prisma as any).agendamento.findUnique({ where: { id } });
  if (!agendamento) throw new NaoEncontrado("Agendamento");

  // Só o próprio responsável pode reagendar/cancelar o compromisso dele.
  if (agendamento.responsavelId !== solicitanteId) {
    throw new NaoAutorizado("Você só pode alterar agendamentos dos quais é responsável");
  }

  const novaData = dados.dataHora ?? agendamento.dataHora;
  const novaDuracao = dados.duracaoMinutos ?? agendamento.duracaoMinutos;

  if (dados.dataHora || dados.duracaoMinutos) {
    if (await existeConflito(agendamento.responsavelId, novaData, novaDuracao, id)) {
      throw new ConflitoDeDados("Já existe um agendamento nesse horário para este responsável");
    }
  }

  return (prisma as any).agendamento.update({ where: { id }, data: dados as any });
}

export async function remover(id: string, solicitanteId: string) {
  const agendamento = await (prisma as any).agendamento.findUnique({ where: { id } });
  if (!agendamento) throw new NaoEncontrado("Agendamento");

  if (agendamento.responsavelId !== solicitanteId) {
    throw new NaoAutorizado("Você só pode remover agendamentos dos quais é responsável");
  }

  await (prisma as any).agendamento.delete({ where: { id } });
}
