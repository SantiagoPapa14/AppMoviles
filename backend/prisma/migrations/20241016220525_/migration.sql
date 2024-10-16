/*
  Warnings:

  - The primary key for the `Quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Quiz` table. All the data in the column will be lost.
  - Added the required column `quizId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "QuizSlide" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER NOT NULL,
    CONSTRAINT "QuizSlide_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("quizId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "quizId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Quiz" ("createdAt", "title", "updatedAt", "userId") SELECT "createdAt", "title", "updatedAt", "userId" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
