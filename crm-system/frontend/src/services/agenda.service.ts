import api from "../services/api";
import type { Agendamento, AtualizarAgendamentoPayload, CriarAgendamentoPayload } from "../types/agenda";

export async function listarAgenda(params?: { minhaAgenda?: boolean }): Promise<Agendamento[]> {
    const { data } = await api.get<Agendamento[]>("/api/agenda", {
        params: params?.minhaAgenda ? { minhaAgenda: true } : undefined,
    });
    return data;
}

export async function obterAgendamento(id: string): Promise<Agendamento> {
    const { data } = await api.get<Agendamento>(`/api/agenda/${id}`);
    return data;
}

export async function criarAgendamento(payload: CriarAgendamentoPayload): Promise<Agendamento> {
    const { data } = await api.post<Agendamento>("/api/agenda", payload);
    return data;
}

export async function atualizarAgendamento(
    id: string,
    payload: AtualizarAgendamentoPayload,
): Promise<Agendamento> {
    const { data } = await api.put<Agendamento>(`/api/agenda/${id}`, payload);
    return data;
}

export async function atualizarStatusAgendamento(id: string, status: string): Promise<Agendamento> {
    const { data } = await api.patch<Agendamento>(`/api/agenda/${id}/status`, { status });
    return data;
}

export async function removerAgendamento(id: string): Promise<void> {
    await api.delete(`/api/agenda/${id}`);
}
