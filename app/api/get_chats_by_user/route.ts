import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest) => {
    const user_id: number = parseInt(new URL(req.url).searchParams.get('u') || '-0');
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        },
        include: {
            chats: {
                include: {
                    messages: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                    },
                },
            },
        },
    });

    const chatsWithLastMessage = user?.chats.map((chat) => ({
        ...chat,
        lastMessage: chat.messages[0] || null,
    }));

    return new Response(JSON.stringify(chatsWithLastMessage))
}

export {handler as GET, handler as POST}