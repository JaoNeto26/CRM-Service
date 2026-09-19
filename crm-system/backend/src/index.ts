import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import express from "express";
import { PrismaClient } from "../generated/prisma_client/client.js";

import authRoutes from "./routes/auth.routes";
import relatoriosRoutes from "./routes/relatorios.routes";
import agendaRoutes from "./routes/agenda.routes";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const app = express();
const prisma = new PrismaClient({
    adapter,
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/relatorios", relatoriosRoutes);
app.use("/api/agenda", agendaRoutes);

app.get("/", (req, res) => {
    console.log("GET / recebido");
    res.json({ message: "Backend funcionando!" });
});

app.get("/appointments", async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
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
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            error: "An error occurred while fetching appointments.",
        });
    }
});

app.get("/users", async (req, res) => {
    const userCount = await prisma.usuario.count();
    res.json(userCount == 0 ? "No users have been added yet." : "Some users have been added to the database.");
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
