/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `proveedores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "proveedores_nombre_key" ON "proveedores"("nombre");
