/*
  Warnings:

  - You are about to drop the `FlashcardSlide` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Flashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `answer` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `cards` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `idFlashcard` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Flashcard` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Flashcard` table. All the data in the column will be lost.
  - Added the required column `back` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deckId` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `front` to the `Flashcard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FlashcardSlide";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Deck" (
    "deckId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flashcard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "deckId" INTEGER NOT NULL,
    CONSTRAINT "Flashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("deckId") ON DELETE RESTRICT ON UPDATE CASCADE
);
DROP TABLE "Flashcard";
ALTER TABLE "new_Flashcard" RENAME TO "Flashcard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
