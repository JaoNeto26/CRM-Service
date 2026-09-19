/*
  Warnings:

  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `negociacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE IF EXISTS "cliente" DROP CONSTRAINT IF EXISTS "cliente_responsavelId_fkey";

-- DropForeignKey
ALTER TABLE IF EXISTS "negociacao" DROP CONSTRAINT IF EXISTS "negociacao_clienteId_fkey";

-- DropTable
DROP TABLE IF EXISTS "cliente";

-- DropTable
DROP TABLE IF EXISTS "negociacao";

-- DropTable
DROP TABLE IF EXISTS "usuario";

-- DropEnum
DROP TYPE IF EXISTS "EtapaNegociacao";

-- DropEnum
DROP TYPE IF EXISTS "statusCliente";
