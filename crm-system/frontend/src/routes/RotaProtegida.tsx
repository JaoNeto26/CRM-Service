import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

import { obterToken } from "@/services/api";

export function RotaProtegida({ children }: PropsWithChildren) {
    //const token = obterToken();
    //if (!token) {
    //    return <Navigate to="/login" replace />;
    //}
    return <>{children}</>;
}
