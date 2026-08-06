export interface ClienteDTO {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  status: "LEAD" | "ATIVO" | "INATIVO";
}
