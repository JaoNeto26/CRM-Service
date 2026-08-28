import { z } from "zod";

export const atualizarUsuarioSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(160).optional(),
}).strict(); // .strict() rejeita campos extras (ex: tentar mandar "senha" ou "id" no body)

export const trocarSenhaSchema = z.object({
  senhaAtual: z.string().min(6).max(200),
  novaSenha: z.string().min(8).max(200),
}).strict();
