import { CalendarClock, RefreshCw, Users, Wrench } from "lucide-react";
import { Link } from "react-router";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useRelatorioResumo } from "@/hooks/useRelatorioResumo";
import { extrairMensagemDeErro } from "@/types/api";

function somarContagens(grupos: Array<{ _count: number }> | undefined) {
    return (grupos ?? []).reduce((total, grupo) => total + grupo._count, 0);
}

function formatarMoeda(valor: number | string) {
    const numero = typeof valor === "string" ? Number(valor) : valor;
    return Number.isFinite(numero)
        ? numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        : "—";
}

export function DashboardPage() {
    const { data: resumo, isLoading, isError, error, refetch, isFetching } = useRelatorioResumo();

    return (
        <AppShell>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-bold text-foreground">Visão geral</h1>
                <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
                    <RefreshCw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                    Atualizar
                </Button>
            </div>

            {isLoading && (
                <div className="flex h-64 items-center justify-center text-muted-foreground">
                    <Spinner className="mr-2" /> Carregando resumo...
                </div>
            )}

            {isError && !isLoading && (
                <Card>
                    <CardContent className="flex flex-col items-start gap-3 p-6">
                        <p className="text-sm text-destructive">
                            {extrairMensagemDeErro(error, "Não foi possível carregar o resumo.")}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            )}

            {resumo && (
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardContent className="flex flex-wrap items-center gap-8 p-6">
                            <Indicador
                                icone={<Users className="h-4 w-4" />}
                                label="Clientes"
                                valor={somarContagens(resumo.clientesPorStatus)}
                            />
                            <div className="h-10 w-px bg-border" />
                            <Indicador
                                icone={<Wrench className="h-4 w-4" />}
                                label="Ordens de serviço"
                                valor={somarContagens(resumo.ordensServicoPorStatus)}
                            />
                            <div className="h-10 w-px bg-border" />
                            <Indicador
                                icone={<CalendarClock className="h-4 w-4" />}
                                label="Compromissos hoje"
                                valor={resumo.agendamentosHoje}
                            />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Negociações por etapa</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {resumo.negociacoesPorEtapa.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Nenhuma negociação registrada.</p>
                                ) : (
                                    <div className="flex h-48 items-end gap-3">
                                        {resumo.negociacoesPorEtapa.map(grupo => {
                                            const maior = Math.max(
                                                ...resumo.negociacoesPorEtapa.map(g => g._count),
                                                1,
                                            );
                                            const alturaPct = Math.max((grupo._count / maior) * 100, 6);
                                            return (
                                                <div key={grupo.etapa} className="flex flex-1 flex-col items-center gap-2">
                                                    <span className="text-xs font-semibold text-foreground">
                                                        {grupo._count}
                                                    </span>
                                                    <div className="flex h-32 w-full items-end">
                                                        <div
                                                            className="w-full rounded-t-lg bg-primary"
                                                            style={{ height: `${alturaPct}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-center text-[11px] leading-tight text-muted-foreground">
                                                        {grupo.etapa}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-primary text-primary-foreground">
                            <CardHeader>
                                <CardTitle>Pipeline em aberto</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <span className="text-3xl font-bold">
                                    {formatarMoeda(resumo.valorEmAbertoPipeline)}
                                </span>
                                <p className="text-sm opacity-80">
                                    Soma das negociações que ainda não foram fechadas.
                                </p>
                                <Button asChild variant="secondary" size="sm" className="mt-2 w-full">
                                    <Link to="/agenda">Ir para a agenda</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <ListaContagem titulo="Clientes por status" grupos={resumo.clientesPorStatus} campo="status" />
                        <ListaContagem
                            titulo="Ordens de serviço por status"
                            grupos={resumo.ordensServicoPorStatus}
                            campo="status"
                        />
                    </div>
                </div>
            )}
        </AppShell>
    );
}

function Indicador({ icone, label, valor }: { icone: React.ReactNode; label: string; valor: number }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                {icone}
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-foreground">{valor}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
            </div>
        </div>
    );
}

function ListaContagem({
    titulo,
    grupos,
    campo,
}: {
    titulo: string;
    grupos: Array<Record<string, unknown> & { _count: number }>;
    campo: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{titulo}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {grupos.length === 0 && <p className="text-sm text-muted-foreground">Sem registros.</p>}
                {grupos.map(grupo => (
                    <div key={String(grupo[campo])} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{String(grupo[campo])}</span>
                        <span className="font-semibold text-foreground">{grupo._count}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
