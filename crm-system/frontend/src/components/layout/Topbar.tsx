import { CircleUserRound } from "lucide-react";

export function Topbar({ nomeUsuario }: { nomeUsuario?: string }) {
    return (
        <header className="flex items-center justify-end gap-3 px-8 pt-6">
            <span className="text-sm font-medium text-foreground/80">{nomeUsuario ?? "Usuário"}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CircleUserRound className="h-6 w-6" />
            </div>
        </header>
    );
}
