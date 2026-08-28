// Erros de domínio tipados — o errorHandler central usa o "status" pra responder certo,
// então nenhum service precisa saber sobre req/res, só lançar o erro semântico.

export class ErroDominio extends Error {
  status: number;
  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.status = status;
    this.name = this.constructor.name;
  }
}

export class NaoEncontrado extends ErroDominio {
  constructor(recurso = "Recurso") {
    super(`${recurso} não encontrado`, 404);
  }
}

export class NaoAutorizado extends ErroDominio {
  constructor(mensagem = "Você não tem permissão para esta ação") {
    super(mensagem, 403);
  }
}

export class RequisicaoInvalida extends ErroDominio {
  constructor(mensagem = "Requisição inválida") {
    super(mensagem, 400);
  }
}

export class ConflitoDeDados extends ErroDominio {
  constructor(mensagem = "Conflito com dados existentes") {
    super(mensagem, 409);
  }
}
