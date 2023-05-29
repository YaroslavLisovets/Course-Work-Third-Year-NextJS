/*
  Warnings:

  - You are about to drop the column `checked` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "checked";

-- AlterTable
ALTER TABLE "RentEquipment" ADD COLUMN     "checked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "returned" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "borrow_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "return_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "claims" SET DEFAULT '';
