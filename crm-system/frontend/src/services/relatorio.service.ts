import api from "../services/api";
import type { RelatorioResumo } from "../types/relatorio";

export async function obterResumo(): Promise<RelatorioResumo> {
    const { data } = await api.get<RelatorioResumo>("/api/relatorios/resumo");
    return data;
}
