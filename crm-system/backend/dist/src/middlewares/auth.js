import jwt from "jsonwebtoken";
export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
        return res.status(401).json({ erro: "Não autenticado" });
    try {
        const payload = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        req.usuarioId = payload.sub;
        next();
    }
    catch (_a) {
        res.status(401).json({ erro: "Token inválido ou expirado" });
    }
}
