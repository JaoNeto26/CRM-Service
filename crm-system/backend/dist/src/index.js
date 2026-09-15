var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import express from "express";
import { PrismaClient } from "../generated/prisma_client";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const app = express();
const prisma = new PrismaClient({
    adapter,
});
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    console.log("GET / recebido");
    res.json({ message: "Backend funcionando!" });
});
app.get("/appointments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield prisma.appointment.findMany({
            include: {
                customer: {
                    select: {
                        name: true,
                    },
                },
                services: {
                    include: {
                        service: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(appointments);
    }
    catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            error: "An error occurred while fetching appointments.",
        });
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield prisma.usuario.count();
    res.json(userCount == 0 ? "No users have been added yet." : "Some users have been added to the database.");
}));
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
