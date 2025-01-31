/*
  Warnings:

  - You are about to drop the column `name` on the `DeckTag` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `QuizTag` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SummaryTag` table. All the data in the column will be lost.
  - Added the required column `tagId` to the `DeckTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `QuizTag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagId` to the `SummaryTag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeckTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "deckId" INTEGER NOT NULL,
    CONSTRAINT "DeckTag_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DeckTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeckTag" ("deckId", "id") SELECT "deckId", "id" FROM "DeckTag";
DROP TABLE "DeckTag";
ALTER TABLE "new_DeckTag" RENAME TO "DeckTag";
CREATE TABLE "new_QuizTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    CONSTRAINT "QuizTag_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizTag" ("id", "quizId") SELECT "id", "quizId" FROM "QuizTag";
DROP TABLE "QuizTag";
ALTER TABLE "new_QuizTag" RENAME TO "QuizTag";
CREATE TABLE "new_SummaryTag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tagId" INTEGER NOT NULL,
    "summaryId" INTEGER NOT NULL,
    CONSTRAINT "SummaryTag_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SummaryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SummaryTag" ("id", "summaryId") SELECT "id", "summaryId" FROM "SummaryTag";
DROP TABLE "SummaryTag";
ALTER TABLE "new_SummaryTag" RENAME TO "SummaryTag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
