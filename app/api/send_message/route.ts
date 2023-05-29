import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";



const handler = async (req: NextRequest) => {
    const data: { user: number, message:string, chatId:number } = await (req.json())
    const prisma = new PrismaClient();

    const createdMessage = await prisma.message.create({
        data: {
            userId: data.user,
            message: data.message,
            chatId: data.chatId, // Replace with the actual chat ID
        },
    });
    await prisma.$disconnect();
    return new Response(JSON.stringify(createdMessage))
}

export {handler as GET, handler as POST}