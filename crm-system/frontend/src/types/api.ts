/**
 * Formato de erro retornado pelo errorHandler do backend
 * (utils/erros.ts -> NaoEncontrado, NaoAutorizado, RequisicaoInvalida, ConflitoDeDados).
 */
export interface ApiErrorResponse {
    erro: string;
    detalhes?: unknown;
}

/** Helper para extrair uma mensagem amigável de um erro do axios/API. */
export function extrairMensagemDeErro(erro: unknown, fallback = "Ocorreu um erro inesperado."): string {
    if (
        typeof erro === "object" &&
        erro !== null &&
        "response" in erro &&
        typeof (erro as { response?: { data?: ApiErrorResponse } }).response?.data?.erro === "string"
    ) {
        return (erro as { response: { data: ApiErrorResponse } }).response.data.erro;
    }
    return fallback;
}
