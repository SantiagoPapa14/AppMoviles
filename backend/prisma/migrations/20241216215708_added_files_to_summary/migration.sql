-- CreateTable
CREATE TABLE "SummaryFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "summaryId" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    CONSTRAINT "SummaryFile_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "Summary" ("projectId") ON DELETE CASCADE ON UPDATE CASCADE
);
