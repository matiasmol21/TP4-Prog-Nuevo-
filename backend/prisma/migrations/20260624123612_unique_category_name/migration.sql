/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `category_nombre_key` ON `category`(`nombre`);
