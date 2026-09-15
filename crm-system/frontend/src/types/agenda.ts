/** Enum real do backend: schemas/agendamento.schema.ts */
export type StatusAgendamento = "AGENDADO" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";

interface ResumoRelacionado {
    id: string;
    nome: string;
}

/**
 * Formato devolvido por GET /api/agenda (agenda.service.listar usa include
 * de cliente e responsavel com select { id, nome }).
 * Atencao: POST /api/agenda NAO faz include, entao o objeto recem-criado
 * vem sem cliente/responsavel — por isso sao opcionais.
 */
export interface Agendamento {
    id: string;
    titulo: string;
    descricao?: string | null;
    dataHora: string; // ISO 8601
    duracaoMinutos: number;
    status: StatusAgendamento;
    clienteId?: string | null;
    responsavelId?: string | null;
    cliente?: ResumoRelacionado | null;
    responsavel?: ResumoRelacionado | null;
}

/** Espelha criarAgendamentoSchema (.strict() — nao enviar campos extras) */
export interface CriarAgendamentoPayload {
    titulo: string;
    descricao?: string;
    dataHora: string;
    duracaoMinutos?: number;
    clienteId?: string;
    responsavelId?: string;
}

/** Espelha atualizarAgendamentoSchema */
export interface AtualizarAgendamentoPayload {
    titulo?: string;
    descricao?: string;
    dataHora?: string;
    duracaoMinutos?: number;
    status?: StatusAgendamento;
}
