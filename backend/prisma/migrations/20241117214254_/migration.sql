/*
  Warnings:

  - You are about to drop the `MindMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Node` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MindMap";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Node";
PRAGMA foreign_keys=on;
