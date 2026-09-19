import { Check, ChevronLeft, ChevronRight, Clock, Hourglass, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAgendaLista } from "@/hooks/useAgenda";
import type { StatusAgendamento } from "@/types/agenda";
import { extrairMensagemDeErro } from "@/types/api";

function chaveDia(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

/**
 * Status reais do backend (STATUS_VALIDOS em services/agenda.service.ts):
 * scheduled | waiting | completed | cancelled.
 */
const STATUS_INFO: Record<StatusAgendamento, { label: string; className: string; icon: typeof Clock }> = {
    scheduled: { label: "Agendado", className: "agenda-note-scheduled", icon: Clock },
    waiting: { label: "Aguardando", className: "agenda-note-confirmed", icon: Hourglass },
    completed: { label: "Concluído", className: "agenda-note-done", icon: Check },
    cancelled: { label: "Cancelado", className: "agenda-note-muted", icon: X },
};

const STATUS_PADRAO = STATUS_INFO.scheduled;

/**
 * Tela SOMENTE de visualizacao dos agendamentos ja cadastrados.
 * Criar, editar, excluir e mudar status ficam exclusivamente no /calendar.
 */
export function AgendaPage() {
    const [mesReferencia, setMesReferencia] = useState(() => new Date());
    const [dataSelecionada, setDataSelecionada] = useState(() => new Date());

    const { data: agendamentos, isLoading, isError, error, refetch } = useAgendaLista(true);

    const diasComCompromisso = useMemo(() => {
        const set = new Set<string>();
        agendamentos?.forEach(agendamento => set.add(chaveDia(new Date(agendamento.dataHora))));
        return set;
    }, [agendamentos]);

    const compromissosDoDia = useMemo(() => {
        if (!agendamentos) return [];
        return agendamentos
            .filter(agendamento => chaveDia(new Date(agendamento.dataHora)) === chaveDia(dataSelecionada))
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [agendamentos, dataSelecionada]);

    const primeiroDiaSemana = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth(), 1).getDay();
    const totalDiasMes = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth(), 0).getDate();
    const celulas = Array.from({ length: 42 }, (_, indice) => {
        const deslocamento = indice - primeiroDiaSemana;
        const data = new Date(mesReferencia.getFullYear(), mesReferencia.getMonth(), deslocamento + 1);
        return {
            data,
            dia: deslocamento < 0 ? ultimoDiaMesAnterior + deslocamento + 1 : data.getDate(),
            foraDoMes: deslocamento < 0 || deslocamento >= totalDiasMes,
        };
    });
    const hoje = chaveDia(new Date());

    return (
        <AppShell>
            <div className="mb-6">
                <p className="text-sm text-muted-foreground">Consulte os agendamentos cadastrados</p>
                <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            </div>

            {isLoading && (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                    <Spinner className="mr-2" /> Carregando agenda...
                </div>
            )}

            {isError && !isLoading && (
                <Card>
                    <CardContent className="flex flex-col items-start gap-3 p-6">
                        <p className="text-sm text-destructive">
                            {extrairMensagemDeErro(error, "Não foi possível carregar a agenda.")}
                        </p>
                        <Button
                            onClick={() => refetch()}
                            className="border border-input bg-background text-foreground hover:bg-accent"
                        >
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            )}

            {agendamentos && (
                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
                    <Card className="overflow-hidden rounded-[24px] shadow-[4px_4px_28px_rgba(0,0,0,0.08)]">
                        <CardContent className="p-5 sm:p-8">
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <button
                                    className="rounded-full p-2 text-2xl text-foreground transition-colors hover:bg-secondary"
                                    onClick={() =>
                                        setMesReferencia(
                                            new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() - 1, 1),
                                        )
                                    }
                                    aria-label="Mês anterior"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <h2 className="text-xl font-bold capitalize text-foreground sm:text-2xl">
                                    {mesReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                                </h2>
                                <button
                                    className="rounded-full p-2 text-2xl text-foreground transition-colors hover:bg-secondary"
                                    onClick={() =>
                                        setMesReferencia(
                                            new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() + 1, 1),
                                        )
                                    }
                                    aria-label="Próximo mês"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                                {["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."].map((dia, indice) => (
                                    <span key={dia} className={indice === 0 || indice === 6 ? "font-bold" : ""}>
                                        {dia}
                                    </span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                {celulas.map(({ data, dia, foraDoMes }) => {
                                    const chave = chaveDia(data);
                                    const selecionado = chave === chaveDia(dataSelecionada);
                                    const ehHoje = chave === hoje;
                                    const temCompromisso = diasComCompromisso.has(chave);
                                    return (
                                        <button
                                            key={chave}
                                            onClick={() => setDataSelecionada(data)}
                                            className={`relative flex aspect-square min-h-10 items-center justify-center rounded-full text-sm transition-colors sm:text-base ${foraDoMes ? "text-muted-foreground/35" : "text-foreground"} ${ehHoje && !selecionado ? "bg-primary text-primary-foreground" : "hover:bg-secondary"} ${selecionado ? "bg-accent font-bold ring-2 ring-primary/20" : ""}`}
                                        >
                                            {dia}
                                            {temCompromisso && (
                                                <span
                                                    className={`absolute bottom-1 h-1 w-1 rounded-full ${selecionado || ehHoje ? "bg-current" : "bg-primary"}`}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[24px] shadow-[4px_4px_24px_rgba(0,0,0,0.08)]">
                        <CardContent className="p-5 sm:p-7">
                            <div className="mb-6 text-center">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    Agendamentos cadastrados
                                </p>
                                <h2 className="mt-1 text-2xl font-bold capitalize text-foreground">
                                    {dataSelecionada.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {compromissosDoDia.length === 0 && (
                                    <p className="py-10 text-center text-sm text-muted-foreground">Agenda vazia</p>
                                )}
                                {compromissosDoDia.map(compromisso => {
                                    const status = STATUS_INFO[compromisso.status] ?? STATUS_PADRAO;
                                    const Icon = status.icon;
                                    return (
                                        <div
                                            key={compromisso.id}
                                            className={`flex items-stretch gap-4 rounded-2xl p-4 ${status.className}`}
                                        >
                                            <div className="min-w-[70px] border-r border-current/20 pr-3">
                                                <p className="text-2xl font-semibold leading-none">
                                                    {new Date(compromisso.dataHora).toLocaleTimeString("pt-BR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                                <p className="mt-2 text-xs opacity-70">
                                                    {compromisso.duracaoMinutos} min
                                                </p>
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                                                <p className="truncate font-semibold">{compromisso.titulo}</p>
                                                {compromisso.cliente && (
                                                    <p className="flex items-center gap-1 text-xs opacity-75">
                                                        <UserRound className="h-3 w-3" />
                                                        {compromisso.cliente.nome}
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-1 text-xs font-medium opacity-80">
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {status.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppShell>
    );
}

