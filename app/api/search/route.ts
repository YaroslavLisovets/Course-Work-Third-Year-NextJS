import {PrismaClient} from "@prisma/client";
import type {NextRequest} from "next/server";
import {mockSession} from "@node_modules/next-auth/client/__tests__/helpers/mocks";


const handler = async (req: NextRequest) => {
    const query = new URL(req.url).searchParams.get('q') || '';
    const user_query:number = parseInt(new URL(req.url).searchParams.get('u')||'-0');
    const prisma = new PrismaClient();
    const users = prisma.user.findMany(
        {
            where: {username: {contains: query, mode: 'insensitive'}, NOT:{id: user_query}},
            select: {id: true, username: true, icon: true}
        })
    const followingIds = await prisma.follows.findMany({
        where: {
            followerId  : user_query,
        },
        select: {
            followingId: true,
        },
    }).then((follows)=>follows.map((follow)=>follow.followingId))

    return new Response(JSON.stringify((await users).map(user => {
        return {id: user.id, username: user.username, icon: user.icon || "/DefaultIcon.svg", following:(followingIds.includes(user.id))}

    })))
}


export {handler as GET, handler as POST}