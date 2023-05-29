/*
  Warnings:

  - You are about to drop the `RoleOnUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoleOnUser" DROP CONSTRAINT "RoleOnUser_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleOnUser" DROP CONSTRAINT "RoleOnUser_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "icon" SET DEFAULT '/DefaultIcon.svg';

-- DropTable
DROP TABLE "RoleOnUser";

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RoleToUser_AB_unique" ON "_RoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
