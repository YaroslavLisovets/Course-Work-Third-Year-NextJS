import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";
import {param} from "@node_modules/ts-interface-checker";


const handler = async (req: NextRequest, params: any) => {
    const prisma = new PrismaClient();
    const id: number = parseInt(params.params.routeId);
    await prisma.$disconnect();
    return new Response(JSON.stringify(await prisma.route.findFirst({where: {id: id}, include: {rest_points: true}})))
}

const update = async (req: NextRequest, params: any) => {
    const data: {
        name: string,
        difficulty: number,
        rest_points: {
            id: number,
            name: string,
            capacity: number,
            description: string
        }[]
    } = await req.json();

    const prisma = new PrismaClient();
    const routeId: number = parseInt(params.params.routeId);
    console.log(routeId);
    // Update the route
    await prisma.route.update({
        where: { id: routeId },
        data: { name: data.name, difficulty: data.difficulty },
    });

    // Update or create the rest points
    for (const restPointData of data.rest_points) {
        const { id, name, capacity, description } = restPointData;
        if (id) {
            await prisma.restPoints.update({
                where: { id },
                data: { name, capacity, description },
            });
        } else {
            await prisma.restPoints.create({
                data: { name, capacity, description:description, routeId } ,
            });
        }
    }

    await prisma.$disconnect();
    return new Response();
};


export {handler as GET, handler as POST}
export {update as PUT}