import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest, params: any) => {
    const prisma = new PrismaClient();
    const equipments = await prisma.equipment.findMany();
    await prisma.$disconnect();
    return new Response(JSON.stringify(equipments))
}

const put_handler = async (req: NextRequest, params: any) => {
    const data: { name: string, price: number, amount: number, characteristic: string } = await (req.json())
    const prisma = new PrismaClient();
    const equipment = await prisma.equipment.create({
        data: {
            name: data.name,
            price: data.price,
            characteristic: data.characteristic,
            amount: data.amount
        }
    })
    await prisma.$disconnect();
    return new Response(JSON.stringify(equipment))
}



export {handler as GET, handler as POST, put_handler as PUT}