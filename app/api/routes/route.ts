import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest, params:any) => {
    const data: { name: string, user: number } = await (req.json())
    const prisma = new PrismaClient();
    console.log(params)
    await prisma.$disconnect();
    return new Response()
}

export {handler as GET, handler as POST}