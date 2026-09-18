import { z } from "zod";

const status = ["AGENDADO", "CONFIRMADO", "CANCELADO", "CONCLUIDO"] as const;

export const criarAgendamentoSchema = z.object({
  titulo: z.string().trim().min(2).max(160),
  descricao: z.string().trim().max(2000).optional(),
  dataHora: z.coerce.date().refine((d) => d.getTime() > Date.now(), {
    message: "A data/hora do agendamento deve ser no futuro",
  }),
  duracaoMinutos: z.number().int().min(5).max(480).optional(), // até 8h
  clienteId: z.string().uuid().optional(),
  responsavelId: z.string().uuid().optional(), // se ausente, assume o usuário logado
}).strict();

export const atualizarAgendamentoSchema = z.object({
  titulo: z.string().trim().min(2).max(160).optional(),
  descricao: z.string().trim().max(2000).optional(),
  dataHora: z.coerce.date().optional(),
  duracaoMinutos: z.number().int().min(5).max(480).optional(),
  status: z.enum(status).optional(),
}).strict();
