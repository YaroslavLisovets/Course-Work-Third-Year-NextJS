import {PrismaClient} from "@prisma/client";
import type {NextRequest} from "next/server";



const handler = async (req: NextRequest) => {
    const data: { name:string, difficulty: number, rest_points:[{name:string, capacity:number, description:string}]} = await (req.json())

    const prisma = new PrismaClient();
    const newRoute = await prisma.route.create({
        data: {
            name:data.name,
            difficulty:data.difficulty,
        },
    });

    const restPointsData = data.rest_points.map((point) => ({
        name: point.name,
        capacity: point.capacity,
        description: point.description,
        routeId: newRoute.id,
    }));

    const newRestPoints = await prisma.restPoints.createMany({
        data: restPointsData,
    });

    return new Response();
}


export {handler as GET, handler as POST}