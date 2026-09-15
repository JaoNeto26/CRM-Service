import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001",
});

const TOKEN_STORAGE_KEY = "crm:token";

api.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function salvarToken(token: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function limparToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function obterToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export default api;
