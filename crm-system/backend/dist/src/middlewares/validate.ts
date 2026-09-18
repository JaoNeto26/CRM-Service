import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { RequisicaoInvalida } from "../utils/erros";

// Valida req.body contra um schema zod. Em caso de falha, corta a requisição
// antes que dado malformado chegue perto do banco.
export const validarBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) {
    return next(new RequisicaoInvalida(JSON.stringify(resultado.error.flatten().fieldErrors)));
  }
  req.body = resultado.data;
  next();
};

// UUID nos parâmetros de rota (:id) — evita erro 500 feio do Prisma quando alguém
// manda um id mal formado, e fecha uma via simples de enumeração/probing.
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validarIdParam(nomeParam = "id") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const valor = req.params[nomeParam];
    if (!UUID_REGEX.test(valor)) {
      return next(new RequisicaoInvalida(`Parâmetro '${nomeParam}' inválido`));
    }
    next();
  };
}
