import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const DIAS_SEMANA = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

interface MonthGridProps {
    mesReferencia: Date;
    dataSelecionada: Date;
    onMudarMes: (novoMes: Date) => void;
    onSelecionarDia: (dia: Date) => void;
    diasComCompromisso: Set<string>;
}

function chaveDia(data: Date) {
    return data.toISOString().slice(0, 10);
}

export function MonthGrid({ mesReferencia, dataSelecionada, onMudarMes, onSelecionarDia, diasComCompromisso }: MonthGridProps) {
    const ano = mesReferencia.getFullYear();
    const mes = mesReferencia.getMonth();

    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
    const diaAnteriorUltimo = new Date(ano, mes, 0).getDate();

    const hoje = new Date();

    const celulas: { dia: number; data: Date; foraDoMes: boolean }[] = [];

    for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
        const dia = diaAnteriorUltimo - i;
        celulas.push({ dia, data: new Date(ano, mes - 1, dia), foraDoMes: true });
    }
    for (let dia = 1; dia <= totalDiasMes; dia++) {
        celulas.push({ dia, data: new Date(ano, mes, dia), foraDoMes: false });
    }
    while (celulas.length % 7 !== 0 || celulas.length < 42) {
        const ultimo = celulas[celulas.length - 1].data;
        const proximo = new Date(ultimo);
        proximo.setDate(proximo.getDate() + 1);
        celulas.push({ dia: proximo.getDate(), data: proximo, foraDoMes: true });
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onMudarMes(new Date(ano, mes - 1, 1))}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/60"
                    aria-label="Mês anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold capitalize text-foreground">
                    {mesReferencia.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </span>
                <button
                    onClick={() => onMudarMes(new Date(ano, mes + 1, 1))}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/60"
                    aria-label="Próximo mês"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                {DIAS_SEMANA.map(dia => (
                    <span key={dia}>{dia}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {celulas.map(({ dia, data, foraDoMes }) => {
                    const ehHoje = chaveDia(data) === chaveDia(hoje);
                    const ehSelecionado = chaveDia(data) === chaveDia(dataSelecionada);
                    const temCompromisso = diasComCompromisso.has(chaveDia(data));

                    return (
                        <button
                            key={data.toISOString()}
                            onClick={() => onSelecionarDia(data)}
                            className={cn(
                                "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm text-foreground/80 hover:bg-secondary/60",
                                foraDoMes && "text-muted-foreground/50",
                                ehHoje && "font-bold text-primary",
                                ehSelecionado && "bg-primary text-primary-foreground hover:bg-primary",
                            )}
                        >
                            {dia}
                            {temCompromisso && !ehSelecionado && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
