/**
 * Status reais do backend: AppointmentStatus no prisma/schema.prisma e
 * STATUS_VALIDOS em services/agenda.service.ts. São minúsculos em inglês —
 * as mesmas chaves que o CSS do calendar já usa nas classes .noted.
 */
export type StatusAgendamento = "scheduled" | "waiting" | "completed" | "cancelled";

interface ResumoRelacionado {
    id: string;
    nome: string;
}

/**
 * Formato devolvido por GET /api/agenda (o backend serializa Appointment
 * para este shape em português via serializar()).
 * Atenção: POST /api/agenda NÃO inclui cliente — por isso é opcional.
 */
export interface Agendamento {
    id: string;
    titulo: string;
    descricao?: string | null;
    dataHora: string; // ISO 8601
    duracaoMinutos: number;
    status: StatusAgendamento;
    cliente?: ResumoRelacionado | null;
}

/** Espelha criarAgendamentoSchema do backend */
export interface CriarAgendamentoPayload {
    titulo: string;
    descricao?: string;
    dataHora: string;
    duracaoMinutos?: number;
    clienteId?: string;
    responsavelId?: string;
}

/** Espelha atualizarAgendamentoSchema do backend (PUT /api/agenda/:id) */
export interface AtualizarAgendamentoPayload {
    titulo?: string;
    descricao?: string;
    dataHora?: string;
    duracaoMinutos?: number;
}

/** Rótulos em português para exibição — o backend guarda em inglês. */
export const ROTULO_STATUS: Record<StatusAgendamento, string> = {
    scheduled: "Agendado",
    waiting: "Aguardando",
    completed: "Concluído",
    cancelled: "Cancelado",
};
