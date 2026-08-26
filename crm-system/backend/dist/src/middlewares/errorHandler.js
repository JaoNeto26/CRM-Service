export function errorHandler(err, req, res, _next) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);
    const status = err.status || 500;
    const mensagem = process.env.NODE_ENV === "production" ? "Erro interno" : err.message;
    res.status(status).json({ erro: mensagem });
}
