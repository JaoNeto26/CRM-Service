import api from "@/services/api";
import type { LoginPayload, LoginResponse, RegistrarPayload, RegistrarResponse } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/auth/login", payload);
    return data;
}

export async function registrar(payload: RegistrarPayload): Promise<RegistrarResponse> {
    const { data } = await api.post<RegistrarResponse>("/api/auth/registrar", payload);
    return data;
}
