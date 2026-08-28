import { z } from "zod";

const statusValidos = ["LEAD", "ATIVO", "INATIVO"] as const;

export const criarClienteSchema = z.object({
  nome: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(160).optional(),
  telefone: z.string().trim().max(30).optional(),
  empresa: z.string().trim().max(160).optional(),
}).strict();

export const atualizarClienteSchema = z.object({
  nome: z.string().trim().min(2).max(160).optional(),
  email: z.string().trim().email().max(160).optional(),
  telefone: z.string().trim().max(30).optional(),
  empresa: z.string().trim().max(160).optional(),
  status: z.enum(statusValidos).optional(),
}).strict();
