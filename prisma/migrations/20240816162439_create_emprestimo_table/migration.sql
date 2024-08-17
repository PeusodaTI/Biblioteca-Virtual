-- CreateTable
CREATE TABLE "emprestimos" (
    "id" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL,
    "dataEmprestimo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDevolucao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "livroId" TEXT,
    "alunoId" TEXT,

    CONSTRAINT "emprestimos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_livroId_fkey" FOREIGN KEY ("livroId") REFERENCES "livros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emprestimos" ADD CONSTRAINT "emprestimos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
