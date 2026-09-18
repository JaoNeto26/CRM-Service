import { z } from "zod";

export const criarNegociacaoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  valor: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero"),
  clienteId: z.string().uuid("clienteId deve ser um UUID válido"),
  etapa: z.enum([
    "PROSPECCAO",
    "QUALIFICACAO",
    "PROPOSTA",
    "NEGOCIACAO",
    "FECHADO_GANHO",
    "FECHADO_PERDIDO",
  ]).optional(),
});

export const atualizarNegociacaoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").optional(),
  valor: z.coerce.number().min(0, "Valor deve ser maior ou igual a zero").optional(),
  etapa: z.enum([
    "PROSPECCAO",
    "QUALIFICACAO",
    "PROPOSTA",
    "NEGOCIACAO",
    "FECHADO_GANHO",
    "FECHADO_PERDIDO",
  ]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Informe ao menos um campo para atualizar a negociação",
});
