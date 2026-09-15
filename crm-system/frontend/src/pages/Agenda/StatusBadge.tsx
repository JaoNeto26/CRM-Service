import { cn } from "@/lib/utils";
import type { StatusAgendamento } from "@/types/agenda";

const ESTILOS: Record<StatusAgendamento, string> = {
    AGENDADO: "bg-secondary text-secondary-foreground",
    CONFIRMADO: "bg-accent text-accent-foreground",
    CONCLUIDO: "bg-primary text-primary-foreground",
    CANCELADO: "bg-destructive/10 text-destructive",
};

const LABELS: Record<StatusAgendamento, string> = {
    AGENDADO: "Agendado",
    CONFIRMADO: "Confirmado",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
};

export function StatusBadge({ status }: { status: StatusAgendamento }) {
    return (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", ESTILOS[status])}>
            {LABELS[status]}
        </span>
    );
}
