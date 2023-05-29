/*
  Warnings:

  - Added the required column `amount` to the `Equipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "amount" INTEGER NOT NULL,
ALTER COLUMN "latitude" SET DEFAULT 0,
ALTER COLUMN "longitude" SET DEFAULT 0;
