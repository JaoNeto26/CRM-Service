import { z } from "zod";
export const criarOrdemServicoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório"),
    descricao: z.string().optional(),
    clienteId: z.string().uuid("clienteId deve ser um UUID válido"),
    responsavelId: z.string().uuid("responsavelId deve ser um UUID válido").optional(),
    prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).optional(),
});
export const atualizarOrdemServicoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório").optional(),
    descricao: z.string().optional(),
    status: z.enum(["ABERTO", "EM_ANDAMENTO", "AGUARDANDO_CLIENTE", "CONCLUIDO", "CANCELADO"]).optional(),
    prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).optional(),
    responsavelId: z.string().uuid("responsavelId deve ser um UUID válido").nullable().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar a ordem de serviço",
});
