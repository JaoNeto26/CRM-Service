import { z } from "zod";

const status = ["ABERTO", "EM_ANDAMENTO", "AGUARDANDO_CLIENTE", "CONCLUIDO", "CANCELADO"] as const;
const prioridades = ["BAIXA", "MEDIA", "ALTA", "URGENTE"] as const;

export const criarOrdemServicoSchema = z.object({
  titulo: z.string().trim().min(3).max(160),
  descricao: z.string().trim().max(2000).optional(),
  clienteId: z.string().uuid(),
  responsavelId: z.string().uuid().optional(),
  prioridade: z.enum(prioridades).optional(),
}).strict();

export const atualizarOrdemServicoSchema = z.object({
  titulo: z.string().trim().min(3).max(160).optional(),
  descricao: z.string().trim().max(2000).optional(),
  status: z.enum(status).optional(),
  prioridade: z.enum(prioridades).optional(),
  responsavelId: z.string().uuid().nullable().optional(),
}).strict();
