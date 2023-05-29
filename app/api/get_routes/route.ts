import {PrismaClient} from "@prisma/client";
import type {NextRequest} from "next/server";
import {mockSession} from "@node_modules/next-auth/client/__tests__/helpers/mocks";


const handler = async (req: NextRequest) => {

    const prisma = new PrismaClient();
    return new Response(JSON.stringify(await prisma.route.findMany()));
}


export {handler as GET, handler as POST}