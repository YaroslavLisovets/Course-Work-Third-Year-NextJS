import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest) => {
    const data: { chatId: number } = await (req.json())
    const prisma = new PrismaClient();
    let messages = prisma.message.findMany({
        where: {
            chatId: data.chatId,
        },
        include: {
            User: {
                select: {
                    username: true,
                    icon: true,
                    id: true,
                },
            },
        },
    });
    const chat = await prisma.chat.findFirst({where:{id:data.chatId}})

    const messages_ =  (await messages).map((message) => ({
        id: message.id,
        content: message.message,
        timestamp: message.createdAt,
        user: {
            id: message.User.id,
            name: message.User.username,
            icon: (message.User.icon.length?message.User.icon:"/DefaultIcon.svg"),
        },
    }))


    await prisma.$disconnect();
    // console.log(chat, await messages)
    return new Response(JSON.stringify({chat_data:chat, messages:(messages_)}))
}


export {handler as GET, handler as POST}