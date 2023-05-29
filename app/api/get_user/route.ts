import {NextRequest} from "@node_modules/next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest) => {

    const user_query: number = parseInt(new URL(req.url).searchParams.get('u') || '-0');
    const prisma = new PrismaClient();
    let user = prisma.user.findFirst(
        {
            where: {id: user_query},
            select: {username: true, icon: true}
        })

    const followingIds = prisma.follows.findMany({
        where: {
            followerId: user_query,
        },
        select: {
            followingId: true,
        },
    }).then((follows) => follows.map((follow) => follow.followingId))

    const followersIds = prisma.follows.findMany({
        where: {
            followingId: user_query,
        },
        select: {
            followerId: true,
        },
    }).then((follows) => follows.map((follow) => follow.followerId))
    // @ts-ignore
    user = await user
    user.icon = user.icon.length?user.icon:'/DefaultIcon.svg';

    return new Response(JSON.stringify({
        username: user?.username,
        icon: user?.icon,
        following: ((await followingIds).length),
        followers: ((await followersIds).length)
    }));
}


export {handler as GET, handler as POST}