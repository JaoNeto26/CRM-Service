import { Navigate, Route, Routes } from "react-router";

import { AgendaPage } from "@/pages/Agenda/AgendaPage";
import { CadastroPage } from "@/pages/Cadastro/CadastroPage";
import Calendar from "@/pages/calendar";
import { DashboardPage } from "@/pages/Dashboard/DashboardPage";
import { LoginPage } from "@/pages/login/LoginPage";
import { RotaProtegida } from "@/routes/RotaProtegida";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route
                path="/dashboard"
                element={
                    <RotaProtegida>
                        <DashboardPage />
                    </RotaProtegida>
                }
            />
            <Route
                path="/agenda"
                element={
                    <RotaProtegida>
                        <AgendaPage />
                    </RotaProtegida>
                }
            />
            <Route
                path="/calendar"
                element={
                    <RotaProtegida>
                        <Calendar />
                    </RotaProtegida>
                }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
