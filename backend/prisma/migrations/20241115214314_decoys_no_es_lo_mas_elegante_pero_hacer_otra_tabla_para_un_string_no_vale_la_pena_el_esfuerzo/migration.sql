/*
  Warnings:

  - Added the required column `decoy1` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decoy2` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `decoy3` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "decoy1" TEXT NOT NULL,
    "decoy2" TEXT NOT NULL,
    "decoy3" TEXT NOT NULL,
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("quizId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("answer", "id", "question", "quizId") SELECT "answer", "id", "question", "quizId" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
