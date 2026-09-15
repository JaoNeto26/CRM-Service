import { z } from "zod";

export const cadastroSchema = z
    .object({
        nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
        email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
        senha: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
        confirmarSenha: z.string().min(1, "Confirme sua senha"),
    })
    .refine(data => data.senha === data.confirmarSenha, {
        message: "As senhas não coincidem",
        path: ["confirmarSenha"],
    });

export type CadastroFormValues = z.infer<typeof cadastroSchema>;
