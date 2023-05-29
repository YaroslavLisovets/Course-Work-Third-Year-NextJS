import {NextRequest} from "@node_modules/next/dist/server/web/spec-extension/request";
import {NextResponse} from "@node_modules/next/dist/server/web/spec-extension/response";

import {PrismaClient} from "@prisma/client";
const handler = async (req: Request) => {
    // console.log(await req.json())
    const r = await req.json()
    console.log(r)
    const prisma = new PrismaClient();
    const user = await prisma.user.update({where:{email:r.email}, data:{icon:r.file}})
    console.log(user.id)

    return new NextResponse()
};

export {handler as GET, handler as POST}