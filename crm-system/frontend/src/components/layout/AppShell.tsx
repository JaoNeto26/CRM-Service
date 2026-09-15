import type { PropsWithChildren } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function AppShell({ children, nomeUsuario }: PropsWithChildren<{ nomeUsuario?: string }>) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Topbar nomeUsuario={nomeUsuario} />
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}
