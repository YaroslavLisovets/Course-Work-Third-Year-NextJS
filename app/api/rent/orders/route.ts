import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest, params: any) => {
    const data: { userId: number } = await req.json();
    const prisma = new PrismaClient();
    const order = await prisma.order.findMany(
        {where: {user_id: data.userId }, include:{OrderedEquipment:{select:{equipment:true}}}});
    await prisma.$disconnect();
    return new Response(JSON.stringify(order))
}
const get_handler = async (req: NextRequest, params: any) => {
    const prisma = new PrismaClient();
    const order = await prisma.order.findMany(
        {where: {checked: false }, include:{OrderedEquipment:{select:{equipment:true}}}});
    await prisma.$disconnect();
    return new Response(JSON.stringify(order))
}

const put_handler = async (req: NextRequest, params: any) => {
    const data: { orderId: number, claims:string } = await req.json();
    const prisma = new PrismaClient();
    const order = await prisma.order.update({where:{id:data.orderId}, data:{checked:true, claims:data.claims}})
    await prisma.$disconnect();
    return new Response(JSON.stringify(order))
}

export {handler as POST, get_handler as GET, put_handler as PUT}