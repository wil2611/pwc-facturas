/*
  Warnings:

  - You are about to alter the column `size_bytes` on the `documentos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "documentos" ALTER COLUMN "size_bytes" SET DATA TYPE INTEGER;
