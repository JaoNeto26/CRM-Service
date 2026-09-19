import { cn } from "@/lib/utils";
import { ROTULO_STATUS, type StatusAgendamento } from "@/types/agenda";

const ESTILOS: Record<StatusAgendamento, string> = {
    scheduled: "bg-secondary text-secondary-foreground",
    waiting: "bg-accent text-accent-foreground",
    completed: "bg-primary text-primary-foreground",
    cancelled: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: StatusAgendamento }) {
    return (
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", ESTILOS[status])}>
            {ROTULO_STATUS[status]}
        </span>
    );
}
