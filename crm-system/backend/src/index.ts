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

app.get("appointments", async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "An error occurred while fetching appointments." });
    }
});
app.get("/", async (req, res) => {
    const userCount = await prisma.usuario.count();
    res.json(userCount == 0 ? "No users have been added yet." : "Some users have been added to the database.");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
