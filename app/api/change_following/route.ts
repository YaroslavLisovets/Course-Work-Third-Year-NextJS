import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest) => {
    const followingId: number = parseInt(new URL(req.url).searchParams.get('followed') || '-0');
    const followerId: number = parseInt(new URL(req.url).searchParams.get('following') || '-0');
    const to: boolean = (new URL(req.url).searchParams.get('to') || 'true') == 'true';
    const prisma = new PrismaClient();

    // console.log(followingId, followerId,"testteast")
    if (to) {
        await prisma.follows.create({data: {followingId, followerId}})
    } else {
        await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followingId,
                    followerId,
                },
            },
        });
    }
    await prisma.$disconnect();
    return new Response();
}


export {handler as GET, handler as POST}