import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Plus, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";


import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useAgendaLista, useCriarAgendamento, useRemoverAgendamento } from "@/hooks/useAgenda";
import { extrairMensagemDeErro } from "@/types/api";

import { MonthGrid } from "./MonthGrid";
import { novoAgendamentoSchema, type NovoAgendamentoFormValues } from "./schema";
import { StatusBadge } from "./StatusBadge";

function chaveDia(data: Date) {
    return data.toISOString().slice(0, 10);
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

    const { data: agendamentos, isLoading, isError, error, refetch } = useAgendaLista(true);
    const criarAgendamento = useCriarAgendamento();
    const removerAgendamento = useRemoverAgendamento();

    const diasComCompromisso = useMemo(() => {
        const set = new Set<string>();
        agendamentos?.forEach((a: { dataHora: string | Date }) =>
            set.add(new Date(a.dataHora).toISOString().slice(0, 10)),
        );
        return set;
    }, [agendamentos]);

    const compromissosDoDia = useMemo(() => {
        if (!agendamentos) return [];
        return agendamentos
            .filter((a: { dataHora: string | Date }) => chaveDia(new Date(a.dataHora)) === chaveDia(dataSelecionada))
            .sort(
                (a: { dataHora: string | Date }, b: { dataHora: string | Date }) =>
                    new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime(),
            );
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
        reset({
            titulo: "",
            descricao: "",
            data: formatarDataInput(dataSelecionada),
            hora: "09:00",
            duracaoMinutos: 30,
        });
        setFormularioAberto(true);
    }

    const onSubmit: SubmitHandler<NovoAgendamentoFormValues> = values => {
        const dataHora = new Date(`${values.data}T${values.hora}:00`).toISOString();
        criarAgendamento.mutate(
            {
                titulo: values.titulo,
                descricao: values.descricao || undefined,
                dataHora,
                duracaoMinutos: values.duracaoMinutos,
            },
            {
                onSuccess: () => setFormularioAberto(false),
            },
        );
    };

    return (
        <AppShell>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Agenda</h1>
                <Button onClick={abrirFormulario}>
                    <Plus className="h-4 w-4" />
                    Novo agendamento
                </Button>
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardContent className="p-6">
                            <MonthGrid
                                mesReferencia={mesReferencia}
                                dataSelecionada={dataSelecionada}
                                onMudarMes={setMesReferencia}
                                onSelecionarDia={setDataSelecionada}
                                diasComCompromisso={diasComCompromisso}
                            />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="capitalize">
                                {dataSelecionada.toLocaleDateString("pt-BR", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "long",
                                })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {compromissosDoDia.length === 0 && (
                                <p className="text-sm text-muted-foreground">Nenhum compromisso neste dia.</p>
                            )}
                            {compromissosDoDia.map(compromisso => (
                                <div
                                    key={compromisso.id}
                                    className="flex items-start justify-between gap-4 rounded-xl border border-border p-4"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-foreground">{compromisso.titulo}</p>
                                            <StatusBadge status={compromisso.status as never} />
                                        </div>
                                        {compromisso.descricao && (
                                            <p className="text-sm text-muted-foreground">{compromisso.descricao}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(compromisso.dataHora).toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                · {compromisso.duracaoMinutos} min
                                            </span>
                                            {compromisso.cliente && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3.5 w-3.5" />
                                                    {compromisso.cliente.nome}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removerAgendamento.mutate(compromisso.id)}
                                        disabled={removerAgendamento.isPending}
                                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                        aria-label="Remover agendamento"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {formularioAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle>Novo agendamento</CardTitle>
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

                                {criarAgendamento.isError && (
                                    <p className="text-sm text-destructive">
                                        {extrairMensagemDeErro(
                                            criarAgendamento.error,
                                            "Não foi possível criar o agendamento (verifique conflito de horário).",
                                        )}
                                    </p>
                                )}

                                <Button type="submit" disabled={criarAgendamento.isPending} className="w-full">
                                    {criarAgendamento.isPending ? "Salvando..." : "Salvar agendamento"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppShell>
    );
}
