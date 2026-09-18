import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as agendaService from "@/services/agenda.service";
import type { AtualizarAgendamentoPayload, CriarAgendamentoPayload } from "@/types/agenda";

const agendaKeys = {
    all: ["agenda"] as const,
    lista: (minhaAgenda?: boolean) => [...agendaKeys.all, "lista", { minhaAgenda: minhaAgenda ?? false }] as const,
};

export function useAgendaLista(minhaAgenda = true) {
    return useQuery({
        queryKey: agendaKeys.lista(minhaAgenda),
        queryFn: () => agendaService.listarAgenda({ minhaAgenda }),
    });
}

export function useCriarAgendamento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CriarAgendamentoPayload) => agendaService.criarAgendamento(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendaKeys.all });
        },
    });
}

export function useAtualizarAgendamento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AtualizarAgendamentoPayload }) =>
            agendaService.atualizarAgendamento(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendaKeys.all });
        },
    });
}

export function useAtualizarStatusAgendamento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            agendaService.atualizarStatusAgendamento(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendaKeys.all });
        },
    });
}

export function useRemoverAgendamento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => agendaService.removerAgendamento(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agendaKeys.all });
        },
    });
}
