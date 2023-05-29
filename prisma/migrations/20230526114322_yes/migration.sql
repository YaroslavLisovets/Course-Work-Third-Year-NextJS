/*
  Warnings:

  - You are about to drop the `RentEquipment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RentEquipment" DROP CONSTRAINT "RentEquipment_equipmentId_fkey";

-- DropForeignKey
ALTER TABLE "RentEquipment" DROP CONSTRAINT "RentEquipment_user_id_fkey";

-- DropTable
DROP TABLE "RentEquipment";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "borrow_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claims" TEXT NOT NULL DEFAULT '',
    "user_id" INTEGER NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipmentToOrder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentToOrder_AB_unique" ON "_EquipmentToOrder"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentToOrder_B_index" ON "_EquipmentToOrder"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToOrder" ADD CONSTRAINT "_EquipmentToOrder_A_fkey" FOREIGN KEY ("A") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipmentToOrder" ADD CONSTRAINT "_EquipmentToOrder_B_fkey" FOREIGN KEY ("B") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
