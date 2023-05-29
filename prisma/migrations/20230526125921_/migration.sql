-- CreateTable
CREATE TABLE "OrderedEquipment" (
    "equipment_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "OrderedEquipment_pkey" PRIMARY KEY ("equipment_id","order_id")
);

-- AddForeignKey
ALTER TABLE "OrderedEquipment" ADD CONSTRAINT "OrderedEquipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedEquipment" ADD CONSTRAINT "OrderedEquipment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
