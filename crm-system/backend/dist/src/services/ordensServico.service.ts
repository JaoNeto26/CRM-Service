import { prisma } from "../config/database";
import { NaoEncontrado, NaoAutorizado } from "../utils/erros";

const ETAPAS_FINAIS = ["CONCLUIDO", "CANCELADO"];

export function listar() {
  return (prisma as any).ordemServico.findMany({
    include: {
      cliente: { select: { id: true, nome: true } },
      responsavel: { select: { id: true, nome: true } },
    },
    orderBy: { criadoEm: "desc" },
  });
}

export async function buscarPorId(id: string) {
  const os = await (prisma as any).ordemServico.findUnique({
    where: { id },
    include: {
      cliente: { select: { id: true, nome: true } },
      responsavel: { select: { id: true, nome: true } },
    },
  });
  if (!os) throw new NaoEncontrado("Ordem de serviço");
  return os;
}

export async function criar(
  criadoPorId: string,
  dados: { titulo: string; descricao?: string; clienteId: string; responsavelId?: string; prioridade?: string }
) {
  const cliente = await (prisma as any).cliente.findUnique({ where: { id: dados.clienteId } });
  if (!cliente) throw new NaoEncontrado("Cliente");

  if (dados.responsavelId) {
    const responsavel = await (prisma as any).usuario.findUnique({ where: { id: dados.responsavelId } });
    if (!responsavel) throw new NaoEncontrado("Usuário responsável");
  }

  return (prisma as any).ordemServico.create({ data: { ...dados, criadoPorId } as any });
}

export async function atualizar(
  id: string,
  solicitanteId: string,
  dados: { titulo?: string; descricao?: string; status?: string; prioridade?: string; responsavelId?: string | null }
) {
  const os = await (prisma as any).ordemServico.findUnique({ where: { id } });
  if (!os) throw new NaoEncontrado("Ordem de serviço");

  // Mudança de status (principalmente fechar/cancelar) só pode ser feita por quem
  // criou a OS ou pelo responsável atual — evita que qualquer usuário autenticado
  // feche o chamado de outra pessoa.
  if (dados.status && os.criadoPorId !== solicitanteId && os.responsavelId !== solicitanteId) {
    throw new NaoAutorizado("Apenas o criador ou o responsável podem alterar o status desta OS");
  }

  if (dados.responsavelId) {
    const responsavel = await (prisma as any).usuario.findUnique({ where: { id: dados.responsavelId } });
    if (!responsavel) throw new NaoEncontrado("Usuário responsável");
  }

  const fechadoEm = dados.status
    ? ETAPAS_FINAIS.includes(dados.status)
      ? new Date()
      : null
    : undefined;

  return (prisma as any).ordemServico.update({
    where: { id },
    data: { ...dados, ...(fechadoEm !== undefined ? { fechadoEm } : {}) } as any,
  });
}

export async function remover(id: string, solicitanteId: string) {
  const os = await (prisma as any).ordemServico.findUnique({ where: { id } });
  if (!os) throw new NaoEncontrado("Ordem de serviço");

  if (os.criadoPorId !== solicitanteId) {
    throw new NaoAutorizado("Apenas quem criou a OS pode removê-la");
  }

  await (prisma as any).ordemServico.delete({ where: { id } });
}
