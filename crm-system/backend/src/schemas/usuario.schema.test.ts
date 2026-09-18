import { describe, expect, it } from 'vitest';
import { atualizarUsuarioSchema, trocarSenhaSchema } from './usuario.schema';

describe('usuario schema', () => {
  it('valida payload de atualização', () => {
    const parsed = atualizarUsuarioSchema.safeParse({
      nome: 'Maria Silva',
      email: 'maria@email.com',
    });

    expect(parsed.success).toBe(true);
  });

  it('valida payload de troca de senha', () => {
    const parsed = trocarSenhaSchema.safeParse({
      senhaAtual: '12345678',
      novaSenha: '87654321',
    });

    expect(parsed.success).toBe(true);
  });
});
