import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const prisma = new PrismaClient({
  adapter,
});

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const userCount = await prisma.usuario.count();
  res.json(
    userCount == 0
      ? "No users have been added yet."
      : "Some users have been added to the database.",
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});