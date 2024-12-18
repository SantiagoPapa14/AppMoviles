/*
  Warnings:

  - You are about to drop the `QuizSlide` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Flashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Flashcard` table. All the data in the column will be lost.
  - Added the required column `cards` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idFlashcard` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "QuizSlide";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("quizId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FlashcardSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idFlashcard" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    CONSTRAINT "FlashcardSlide_idFlashcard_fkey" FOREIGN KEY ("idFlashcard") REFERENCES "Flashcard" ("idFlashcard") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flashcard" (
    "idFlashcard" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cards" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flashcard" ("answer", "createdAt", "updatedAt", "userId") SELECT "answer", "createdAt", "updatedAt", "userId" FROM "Flashcard";
DROP TABLE "Flashcard";
ALTER TABLE "new_Flashcard" RENAME TO "Flashcard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
