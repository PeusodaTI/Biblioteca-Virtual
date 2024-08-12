-- CreateTable
CREATE TABLE "Livro" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordenadorId" TEXT,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Livro" ADD CONSTRAINT "Livro_coordenadorId_fkey" FOREIGN KEY ("coordenadorId") REFERENCES "coordenadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
