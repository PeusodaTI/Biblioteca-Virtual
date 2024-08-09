-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_coordenadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_coordenadores" ("id", "matricula", "nome", "telefone") SELECT "id", "matricula", "nome", "telefone" FROM "coordenadores";
DROP TABLE "coordenadores";
ALTER TABLE "new_coordenadores" RENAME TO "coordenadores";
CREATE UNIQUE INDEX "coordenadores_matricula_key" ON "coordenadores"("matricula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
