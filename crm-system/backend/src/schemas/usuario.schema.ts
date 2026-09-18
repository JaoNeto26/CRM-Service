import { z } from "zod";

export const atualizarUsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Informe ao menos um campo para atualizar o usuário",
});

export const trocarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
  novaSenha: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
});
