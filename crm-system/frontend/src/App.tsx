import { Navigate, Route, Routes } from "react-router";

import { AgendaPage } from "frontend/src/pages/Agenda/AgendaPage";
import { CadastroPage } from "frontend/src/pages/Cadastro/CadastroPage";
import { DashboardPage } from "frontend/src/pages/Dashboard/DashboardPage";
import { LoginPage } from "frontend/src/pages/login/LoginPage";
import { RotaProtegida } from "frontend/src/routes/RotaProtegida";

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
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
