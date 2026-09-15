import { Calendar, LayoutDashboard, Scissors, Settings, Users } from "lucide-react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Início", icon: LayoutDashboard },
    { to: "/clientes", label: "Clientes", icon: Users },
    { to: "/agenda", label: "Agenda", icon: Calendar },
    { to: "/configuracoes", label: "Config", icon: Settings },
];

export function Sidebar() {
    return (
        <aside className="flex h-full w-64 shrink-0 flex-col gap-8 p-6">
            <div className="flex items-center gap-2 px-2">
                <Scissors className="h-6 w-6 text-primary" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-foreground">Bem vindo!</span>
            </div>

            <nav className="flex flex-col gap-1.5">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary/60",
                                isActive && "bg-primary text-primary-foreground hover:bg-primary",
                            )
                        }
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
