/*
  Warnings:

  - You are about to drop the column `role` on the `RoleOnUser` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `RoleOnUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RoleOnUser" DROP COLUMN "role",
DROP COLUMN "user";
