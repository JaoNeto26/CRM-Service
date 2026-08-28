import { describe, expect, it } from "vitest";
import { criarAgendamentoSchema, atualizarAgendamentoSchema } from "./agendamento.schema";

describe("agendamento schema", () => {
  it("valida payload de criação", () => {
    const parsed = criarAgendamentoSchema.safeParse({
      titulo: "Consulta inicial",
      descricao: "Atendimento com cliente",
      dataHora: "2026-08-29T10:00:00.000Z",
      duracaoMinutos: 60,
      clienteId: "123e4567-e89b-12d3-a456-426614174000",
      responsavelId: "123e4567-e89b-12d3-a456-426614174001",
    });

    expect(parsed.success).toBe(true);
  });

  it("valida payload de atualização", () => {
    const parsed = atualizarAgendamentoSchema.safeParse({
      titulo: "Consulta revisada",
      dataHora: "2026-08-29T11:00:00.000Z",
      status: "CONCLUIDO",
    });

    expect(parsed.success).toBe(true);
  });
});
