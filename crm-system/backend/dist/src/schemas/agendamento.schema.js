import { z } from "zod";
export const criarAgendamentoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().optional(),
    dataHora: z.coerce.date({
        invalid_type_error: "dataHora deve ser uma data válida",
    }),
    duracaoMinutos: z.coerce.number().int().positive().default(30),
    clienteId: z.string().uuid().optional(),
    responsavelId: z.string().uuid().optional(),
});
export const atualizarAgendamentoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório").optional(),
    descricao: z.string().optional(),
    dataHora: z.coerce.date({
        invalid_type_error: "dataHora deve ser uma data válida",
    }).optional(),
    duracaoMinutos: z.coerce.number().int().positive().optional(),
    status: z.enum(["AGENDADO", "CONCLUIDO", "CANCELADO"]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar o agendamento",
});
