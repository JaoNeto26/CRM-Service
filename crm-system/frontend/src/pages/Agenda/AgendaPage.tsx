import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Clock, Pencil, Plus, RefreshCw, Trash2, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";


import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAgendaLista, useAtualizarAgendamento, useAtualizarStatusAgendamento, useCriarAgendamento, useRemoverAgendamento } from "@/hooks/useAgenda";
import { extrairMensagemDeErro } from "@/types/api";

import { novoAgendamentoSchema, type NovoAgendamentoFormValues } from "./schema";
function chaveDia(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

function formatarDataInput(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

export function AgendaPage() {
    const [mesReferencia, setMesReferencia] = useState(() => new Date());
    const [dataSelecionada, setDataSelecionada] = useState(() => new Date());
    const [formularioAberto, setFormularioAberto] = useState(false);
    const [agendamentoEditando, setAgendamentoEditando] = useState<string | null>(null);

    const { data: agendamentos, isLoading, isError, error, refetch } = useAgendaLista(true);
    const criarAgendamento = useCriarAgendamento();
    const atualizarAgendamento = useAtualizarAgendamento();
    const atualizarStatus = useAtualizarStatusAgendamento();
    const removerAgendamento = useRemoverAgendamento();

    const diasComCompromisso = useMemo(() => {
        const set = new Set<string>();
        agendamentos?.forEach(agendamento =>
            set.add(chaveDia(new Date(agendamento.dataHora))),
        );
        return set;
    }, [agendamentos]);

    const compromissosDoDia = useMemo(() => {
        if (!agendamentos) return [];
        return agendamentos
            .filter(agendamento => chaveDia(new Date(agendamento.dataHora)) === chaveDia(dataSelecionada))
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
    }, [agendamentos, dataSelecionada]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NovoAgendamentoFormValues>({
        resolver: zodResolver(novoAgendamentoSchema),
        defaultValues: {
            titulo: "",
            descricao: "",
            data: formatarDataInput(dataSelecionada),
            hora: "09:00",
            duracaoMinutos: 30,
        },
    });

    function abrirFormulario() {
        setAgendamentoEditando(null);
        reset({
            titulo: "",
            descricao: "",
            data: formatarDataInput(dataSelecionada),
            hora: "09:00",
            duracaoMinutos: 30,
        });
        setFormularioAberto(true);
    }

    function editarAgendamento(agendamento: (typeof compromissosDoDia)[number]) {
        const data = new Date(agendamento.dataHora);
        reset({
            titulo: agendamento.titulo,
            descricao: agendamento.descricao ?? "",
            data: formatarDataInput(data),
            hora: data.toTimeString().slice(0, 5),
            duracaoMinutos: agendamento.duracaoMinutos,
        });
        setAgendamentoEditando(agendamento.id);
        setFormularioAberto(true);
    }

    const onSubmit: SubmitHandler<NovoAgendamentoFormValues> = values => {
        const dataHora = new Date(`${values.data}T${values.hora}:00`).toISOString();
        const payload = {
                titulo: values.titulo,
                descricao: values.descricao || undefined,
                dataHora,
                duracaoMinutos: values.duracaoMinutos,
        };
        if (agendamentoEditando) {
            atualizarAgendamento.mutate({ id: agendamentoEditando, payload }, {
                onSuccess: () => { setFormularioAberto(false); setAgendamentoEditando(null); },
            });
        } else {
            criarAgendamento.mutate(payload, { onSuccess: () => setFormularioAberto(false) });
        }
    };

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
    const statusInfo = (status: string) => {
        const normalizado = status.toLowerCase();
        if (normalizado.includes("cancel")) return { label: "Cancelado", className: "agenda-note-muted", icon: X };
        if (normalizado.includes("conclu")) return { label: "Concluído", className: "agenda-note-done", icon: Check };
        if (normalizado.includes("confirm")) return { label: "Confirmado", className: "agenda-note-confirmed", icon: Check };
        return { label: "Agendado", className: "agenda-note-scheduled", icon: Clock };
    };

    return (
        <AppShell>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Organize seu dia</p>
                    <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
                        <RefreshCw className={isLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                        Atualizar
                    </Button>
                    <Button onClick={abrirFormulario}>
                        <Plus className="h-4 w-4" />
                        Novo agendamento
                    </Button>
                </div>
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
                        <Button onClick={() => refetch()} className="border border-input bg-background text-foreground hover:bg-accent">
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
                                    onClick={() => setMesReferencia(new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() - 1, 1))}
                                    aria-label="Mês anterior"
                                ><ChevronLeft className="h-6 w-6" /></button>
                                <h2 className="text-xl font-bold capitalize text-foreground sm:text-2xl">
                                    {mesReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                                </h2>
                                <button
                                    className="rounded-full p-2 text-2xl text-foreground transition-colors hover:bg-secondary"
                                    onClick={() => setMesReferencia(new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() + 1, 1))}
                                    aria-label="Próximo mês"
                                ><ChevronRight className="h-6 w-6" /></button>
                            </div>
                            <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:text-sm">
                                {["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."].map((dia, indice) => (
                                    <span key={dia} className={indice === 0 || indice === 6 ? "font-bold" : ""}>{dia}</span>
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
                                            {temCompromisso && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${selecionado || ehHoje ? "bg-current" : "bg-primary"}`} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[24px] shadow-[4px_4px_24px_rgba(0,0,0,0.08)]">
                        <CardContent className="p-5 sm:p-7">
                            <div className="mb-6 text-center">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Compromissos</p>
                                <h2 className="mt-1 text-2xl font-bold capitalize text-foreground">
                                    {dataSelecionada.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                                </h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {compromissosDoDia.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Agenda vazia</p>}
                                {compromissosDoDia.map(compromisso => {
                                    const status = statusInfo(compromisso.status);
                                    const Icon = status.icon;
                                    return (
                                        <div key={compromisso.id} className={`flex items-stretch gap-4 rounded-2xl p-4 ${status.className}`}>
                                            <div className="min-w-[70px] border-r border-current/20 pr-3">
                                                <p className="text-2xl font-semibold leading-none">
                                                    {new Date(compromisso.dataHora).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                                </p>
                                                <p className="mt-2 text-xs opacity-70">{compromisso.duracaoMinutos} min</p>
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                                                <p className="truncate font-semibold">{compromisso.titulo}</p>
                                                {compromisso.cliente && <p className="flex items-center gap-1 text-xs opacity-75"><UserRound className="h-3 w-3" />{compromisso.cliente.nome}</p>}
                                                <p className="flex items-center gap-1 text-xs font-medium opacity-80"><Icon className="h-3.5 w-3.5" />{status.label}</p>
                                            </div>
                                            <div className="flex items-center gap-1 self-start">
                                                <select
                                                    value={compromisso.status.toLowerCase()}
                                                    onChange={event => atualizarStatus.mutate({ id: compromisso.id, status: event.target.value })}
                                                    disabled={atualizarStatus.isPending}
                                                    className="max-w-[105px] rounded-md border-0 bg-black/5 px-1.5 py-1 text-[11px] font-semibold outline-none"
                                                    aria-label="Status do agendamento"
                                                >
                                                    <option value="scheduled">Agendado</option>
                                                    <option value="waiting">Aguardando</option>
                                                    <option value="completed">Concluído</option>
                                                    <option value="cancelled">Cancelado</option>
                                                </select>
                                                <button onClick={() => editarAgendamento(compromisso)} className="rounded-lg p-1.5 opacity-60 transition-opacity hover:bg-black/10 hover:opacity-100" aria-label="Editar agendamento"><Pencil className="h-4 w-4" /></button>
                                                <button onClick={() => removerAgendamento.mutate(compromisso.id)} disabled={removerAgendamento.isPending} className="rounded-lg p-1.5 opacity-60 transition-opacity hover:bg-black/10 hover:opacity-100" aria-label="Remover agendamento"><Trash2 className="h-4 w-4" /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {formularioAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle>{agendamentoEditando ? "Editar agendamento" : "Novo agendamento"}</CardTitle>
                            <button
                                onClick={() => setFormularioAberto(false)}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-secondary/60"
                                aria-label="Fechar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="flex flex-col gap-4"
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                            >
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="titulo">Título</Label>
                                    <Input id="titulo" aria-invalid={!!errors.titulo} {...register("titulo")} />
                                    {errors.titulo && (
                                        <p className="text-xs text-destructive">{errors.titulo.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="descricao">Descrição (opcional)</Label>
                                    <Input id="descricao" {...register("descricao")} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="data">Data</Label>
                                        <Input id="data" type="date" aria-invalid={!!errors.data} {...register("data")} />
                                        {errors.data && <p className="text-xs text-destructive">{errors.data.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="hora">Horário</Label>
                                        <Input id="hora" type="time" aria-invalid={!!errors.hora} {...register("hora")} />
                                        {errors.hora && <p className="text-xs text-destructive">{errors.hora.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="duracaoMinutos">Duração (minutos)</Label>
                                    <Input
                                        id="duracaoMinutos"
                                        type="number"
                                        min={5}
                                        step={5}
                                        aria-invalid={!!errors.duracaoMinutos}
                                        {...register("duracaoMinutos")}
                                    />
                                    {errors.duracaoMinutos && (
                                        <p className="text-xs text-destructive">{errors.duracaoMinutos.message}</p>
                                    )}
                                </div>

                                {(criarAgendamento.isError || atualizarAgendamento.isError) && (
                                    <p className="text-sm text-destructive">
                                        {extrairMensagemDeErro(
                                            criarAgendamento.error ?? atualizarAgendamento.error,
                                            "Não foi possível salvar o agendamento.",
                                        )}
                                    </p>
                                )}

                                <Button type="submit" disabled={criarAgendamento.isPending || atualizarAgendamento.isPending} className="w-full">
                                    {criarAgendamento.isPending || atualizarAgendamento.isPending ? "Salvando..." : "Salvar agendamento"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppShell>
    );
}
