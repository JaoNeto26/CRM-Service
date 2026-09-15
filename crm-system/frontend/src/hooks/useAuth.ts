import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { limparToken, salvarToken } from "@/services/api";
import * as authService from "@/services/auth.service";
import type { LoginPayload, RegistrarPayload } from "@/types/auth";

export function useLogin() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: LoginPayload) => authService.login(payload),
        onSuccess: data => {
            salvarToken(data.token);
            navigate("/dashboard", { replace: true });
        },
    });
}

export function useRegistrar() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: RegistrarPayload) => authService.registrar(payload),
        // POST /api/auth/registrar devolve so { id, nome, email } — sem token.
        // Entao nao da pra autenticar direto: manda pro login com aviso de sucesso.
        onSuccess: () => {
            navigate("/login", { replace: true, state: { cadastroConcluido: true } });
        },
    });
}

export function useLogout() {
    const navigate = useNavigate();
    return () => {
        limparToken();
        navigate("/login", { replace: true });
    };
}
