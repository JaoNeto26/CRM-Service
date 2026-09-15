import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { obterToken } from "frontend/src/services/api";

export function RotaProtegida({ children }: PropsWithChildren) {
    const token = obterToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
