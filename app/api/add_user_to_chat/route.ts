import {PrismaClient} from "@prisma/client";
import type {NextRequest} from "next/server";
import {mockSession} from "@node_modules/next-auth/client/__tests__/helpers/mocks";


const handler = async (req: NextRequest) => {
    const data: { chatId: number, userId: number } = await (req.json())
    const prisma = new PrismaClient();
    await prisma.chat.update({where:{id:data.chatId}, data:{users:{connect:{id:data.userId}}}})
    await prisma.$disconnect();
    return new Response();
}


export {handler as GET, handler as POST}