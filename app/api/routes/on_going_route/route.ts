import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest, params:any) => {
    const prisma = new PrismaClient();
    const data: { user_id: number } = await (req.json())
    const route = await prisma.finishedRoutes.findFirst({where:{start_date:{equals:prisma.finishedRoutes.fields.end_date}, userId:data.user_id}})
    await prisma.$disconnect();
    return new Response(JSON.stringify(route))
}

export {handler as GET, handler as POST, handler as PUT}