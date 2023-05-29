import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest, params: any) => {
    const prisma = new PrismaClient();
    const data: { user_id: number, route_id: number, rate: number, row_id: number } = await (req.json())

    let route = await prisma.finishedRoutes.findFirst({
        where: {
            start_date: {equals: prisma.finishedRoutes.fields.end_date},
            userId: data.user_id,
            route_id: data.route_id
        }
    })
    if (data.rate) {
        if ((await prisma.finishedRoutes.aggregate({
            where: {userId: data.user_id, route_id: data.route_id},
            _count: {userId: true}
        }))._count.userId > 1) {
            const average = await prisma.route.findFirst({
                where: {id: data.route_id},
                select: {amount_rates: true, rate: true}
            })
            const prev_rate = await prisma.finishedRoutes.findFirst({
                where: {
                    route_id: data.route_id,
                    userId: data.user_id,
                    NOT: {id: data.row_id}
                }, orderBy: {id: 'desc'},
                select: {rate: true}
            })
            if (average && prev_rate) {
                let new_average = (average.amount_rates * average.rate + data.rate) / (average.amount_rates + 1)
                new_average = ((average.amount_rates + 1) * new_average - prev_rate.rate) / ((average.amount_rates + 1) - 1)
                await prisma.route.update({data: {rate: new_average}, where: {id: data.route_id}})
            }
        } else {

            const average = await prisma.route.findFirst({
                where: {id: data.route_id},
                select: {amount_rates: true, rate: true}
            })
            if (average) {

                let new_average = (average.amount_rates * average.rate + data.rate) / (average.amount_rates + 1)
                if(!average.amount_rates){
                    new_average = data.rate
                }
                await prisma.route.update({
                    data: {rate: new_average, amount_rates: {increment: 1}},
                    where: {id: data.route_id}
                })
            }
        }
        await prisma.finishedRoutes.update({where: {id: data.row_id}, data: {end_date: new Date(), rate:data.rate}})
    } else {

        route = await prisma.finishedRoutes.create({data: {route_id: data.route_id, userId: data.user_id}})
    }

    await prisma.$disconnect();
    return new Response(JSON.stringify(route))
}

export {handler as GET, handler as POST, handler as PUT}