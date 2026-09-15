export interface Usuario {
    id: string;
    nome: string;
    email: string;
}

export interface LoginPayload {
    email: string;
    senha: string;
}

export interface RegistrarPayload {
    nome: string;
    email: string;
    senha: string;
}

/** POST /api/auth/login -> { token, usuario } */
export interface LoginResponse {
    token: string;
    usuario: Usuario;
}

/** POST /api/auth/registrar -> { id, nome, email }  (NAO retorna token) */
export type RegistrarResponse = Usuario;
