/*
  Warnings:

  - You are about to drop the `_EquipmentToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderedEquipment" DROP CONSTRAINT "OrderedEquipment_equipment_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderedEquipment" DROP CONSTRAINT "OrderedEquipment_order_id_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToOrder" DROP CONSTRAINT "_EquipmentToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToOrder" DROP CONSTRAINT "_EquipmentToOrder_B_fkey";

-- DropTable
DROP TABLE "_EquipmentToOrder";

-- AddForeignKey
ALTER TABLE "OrderedEquipment" ADD CONSTRAINT "OrderedEquipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedEquipment" ADD CONSTRAINT "OrderedEquipment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
