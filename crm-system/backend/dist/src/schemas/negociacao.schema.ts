import { z } from "zod";

const etapas = ["PROSPECCAO", "QUALIFICACAO", "PROPOSTA", "NEGOCIACAO", "FECHADO_GANHO", "FECHADO_PERDIDO"] as const;

export const criarNegociacaoSchema = z.object({
  titulo: z.string().trim().min(2).max(160),
  valor: z.number().nonnegative().max(999_999_999),
  clienteId: z.string().uuid(),
  etapa: z.enum(etapas).optional(),
}).strict();

export const atualizarNegociacaoSchema = z.object({
  titulo: z.string().trim().min(2).max(160).optional(),
  valor: z.number().nonnegative().max(999_999_999).optional(),
  etapa: z.enum(etapas).optional(),
}).strict();
