/*
  Warnings:

  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `negociacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_responsavelId_fkey";

-- DropForeignKey
ALTER TABLE "negociacao" DROP CONSTRAINT "negociacao_clienteId_fkey";

-- DropTable
DROP TABLE "cliente";

-- DropTable
DROP TABLE "negociacao";

-- DropTable
DROP TABLE "usuario";

-- DropEnum
DROP TYPE "EtapaNegociacao";

-- DropEnum
DROP TYPE "statusCliente";
