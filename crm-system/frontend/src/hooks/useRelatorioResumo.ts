import { useQuery } from "@tanstack/react-query";

import * as relatorioService from "@/services/relatorio.service";

export function useRelatorioResumo() {
    return useQuery({
        queryKey: ["relatorios", "resumo"],
        queryFn: relatorioService.obterResumo,
    });
}
