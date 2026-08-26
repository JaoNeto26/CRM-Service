import jwt from "jsonwebtoken";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { autenticar } from "./auth.js";
import { errorHandler } from "./errorHandler.js";
const jwtSecret = "test-secret";
function createResponse() {
    const response = {
        status: vi.fn(),
        json: vi.fn(),
    };
    response.status.mockReturnValue(response);
    return response;
}
describe("autenticar", () => {
    beforeEach(() => {
        process.env.JWT_SECRET = jwtSecret;
    });
    it("rejects requests without a bearer token", () => {
        const request = { headers: {} };
        const response = createResponse();
        const next = vi.fn();
        autenticar(request, response, next);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ erro: "Não autenticado" });
        expect(next).not.toHaveBeenCalled();
    });
    it("stores the user id and continues for a valid token", () => {
        const token = jwt.sign({ sub: "user-123" }, jwtSecret);
        const request = {
            headers: { authorization: `Bearer ${token}` },
        };
        const response = createResponse();
        const next = vi.fn();
        autenticar(request, response, next);
        expect(request.usuarioId).toBe("user-123");
        expect(next).toHaveBeenCalledOnce();
        expect(response.status).not.toHaveBeenCalled();
    });
    it("rejects an invalid token", () => {
        const request = {
            headers: { authorization: "Bearer invalid-token" },
        };
        const response = createResponse();
        const next = vi.fn();
        autenticar(request, response, next);
        expect(response.status).toHaveBeenCalledWith(401);
        expect(response.json).toHaveBeenCalledWith({ erro: "Token inválido ou expirado" });
        expect(next).not.toHaveBeenCalled();
    });
});
describe("errorHandler", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    beforeEach(() => {
        process.env.NODE_ENV = "development";
    });
    afterEach(() => {
        consoleError.mockClear();
    });
    it("returns the error status and message outside production", () => {
        const response = createResponse();
        const request = { method: "GET", path: "/clients" };
        errorHandler({ status: 422, message: "Invalid client" }, request, response, vi.fn());
        expect(response.status).toHaveBeenCalledWith(422);
        expect(response.json).toHaveBeenCalledWith({ erro: "Invalid client" });
    });
    it("hides internal error details in production", () => {
        process.env.NODE_ENV = "production";
        const response = createResponse();
        const request = { method: "GET", path: "/clients" };
        errorHandler(new Error("Database password"), request, response, vi.fn());
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({ erro: "Erro interno" });
    });
});
