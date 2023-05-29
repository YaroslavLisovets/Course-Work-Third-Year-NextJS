import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest) => {
    const data: { name: string, user: number } = await (req.json())
    const prisma = new PrismaClient();
    const chat = await prisma.chat.create({data: {name: data.name, users: {connect: [{id: data.user}]}}})

    await prisma.$disconnect();
    return new Response(JSON.stringify(chat))
}

export {handler as GET, handler as POST}