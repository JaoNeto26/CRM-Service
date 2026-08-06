import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface Cliente {
  id: string;
  nome: string;
  email?: string;
  status: string;
}

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    api.get("/clientes").then((res) => setClientes(res.data)).catch(console.error);
  }, []);

  return (
    <div className="dashboard">
      <h1>CRM - Clientes</h1>
      <ul>
        {clientes.map((c) => (
          <li key={c.id}>
            {c.nome} — {c.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
