import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const delete_handler = async (req: NextRequest, ctx: any) => {
    const data: any = await (req.json())

    const prisma = new PrismaClient();

    const item = await prisma.cartItem.delete({where:{id:data.item_id}})

    await prisma.equipment.update({where:{id:item.equipmentId}, data:{amount:{increment:item.amount}}});

    await prisma.$disconnect();
    return new Response(JSON.stringify({ success: true }))
}

export {delete_handler as POST}