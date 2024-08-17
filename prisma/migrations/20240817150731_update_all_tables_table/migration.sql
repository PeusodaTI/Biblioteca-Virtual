/*
  Warnings:

  - You are about to drop the column `disponivel` on the `emprestimos` table. All the data in the column will be lost.
  - Added the required column `disponivel` to the `livros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emprestimos" DROP COLUMN "disponivel";

-- AlterTable
ALTER TABLE "livros" ADD COLUMN     "disponivel" BOOLEAN NOT NULL;
