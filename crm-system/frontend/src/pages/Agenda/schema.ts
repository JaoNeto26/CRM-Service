import { z } from "zod";

export const novoAgendamentoSchema = z
    .object({
        // backend: min(2).max(160)
        titulo: z.string().trim().min(2, "Título deve ter ao menos 2 caracteres").max(160, "Máximo de 160 caracteres"),
        descricao: z.string().trim().max(2000, "Máximo de 2000 caracteres").optional(),
        data: z.string().min(1, "Informe a data"),
        hora: z.string().min(1, "Informe o horário"),
        // backend: int().min(5).max(480)
        duracaoMinutos: z.coerce
            .number()
            .int("Use um número inteiro")
            .min(5, "Mínimo de 5 minutos")
            .max(480, "Máximo de 480 minutos (8h)"),
    })
    // backend rejeita data/hora no passado (refine em criarAgendamentoSchema).
    // Validar aqui evita um 400 desnecessario.
    .refine(
        valores => {
            const quando = new Date(`${valores.data}T${valores.hora}:00`);
            return !Number.isNaN(quando.getTime()) && quando.getTime() > Date.now();
        },
        { message: "A data e hora devem ser no futuro", path: ["hora"] },
    );

export type NovoAgendamentoFormValues = z.infer<typeof novoAgendamentoSchema>;
