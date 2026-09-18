import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import { NaoEncontrado, NaoAutorizado, RequisicaoInvalida } from "../utils/erros";

// Campos seguros pra devolver ao cliente — "senha" NUNCA entra aqui.
// Usar select explícito em vez de "omit senha depois" evita vazamento
// se alguém adicionar um campo sensível novo no schema e esquecer de tratar.
const SELECT_PUBLICO = { id: true, nome: true, email: true, criadoEm: true } as const;

export function listar() {
  return (prisma as any).usuario.findMany({ select: SELECT_PUBLICO, orderBy: { nome: "asc" } });
}

export async function buscarPorId(id: string) {
  const usuario = await (prisma as any).usuario.findUnique({ where: { id }, select: SELECT_PUBLICO });
  if (!usuario) throw new NaoEncontrado("Usuário");
  return usuario;
}

// Só o próprio usuário pode editar seu perfil — solicitanteId vem do JWT (req.usuarioId),
// nunca do body, então não dá pra um usuário passar o id de outro e editá-lo (IDOR).
export async function atualizar(id: string, solicitanteId: string, dados: { nome?: string; email?: string }) {
  if (id !== solicitanteId) throw new NaoAutorizado("Você só pode editar o seu próprio perfil");

  const usuario = await (prisma as any).usuario.findUnique({ where: { id } });
  if (!usuario) throw new NaoEncontrado("Usuário");

  return (prisma as any).usuario.update({ where: { id }, data: dados, select: SELECT_PUBLICO });
}

export async function trocarSenha(id: string, solicitanteId: string, senhaAtual: string, novaSenha: string) {
  if (id !== solicitanteId) throw new NaoAutorizado("Você só pode alterar a sua própria senha");

  const usuario = await (prisma as any).usuario.findUnique({ where: { id } });
  if (!usuario) throw new NaoEncontrado("Usuário");

  const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
  if (!senhaValida) throw new RequisicaoInvalida("Senha atual incorreta");

  const novaSenhaHash = await bcrypt.hash(novaSenha, 12);
  await (prisma as any).usuario.update({ where: { id }, data: { senha: novaSenhaHash } });
}
