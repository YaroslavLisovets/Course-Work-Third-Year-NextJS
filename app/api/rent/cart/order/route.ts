import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";

const handler = async (req: NextRequest) => {
    const data: { cartId: number, date:string } = await req.json();

    const prisma = new PrismaClient();

    const cart = await prisma.cart.findFirst({
        where: { id: data.cartId },
        include: { cartItems: { include: { equipment: true } } },
    });

    if (!cart) {
        // Cart not found
        await prisma.$disconnect();
        return new Response("Cart not found", { status: 404 });
    }

    const equipment = cart. cartItems.map((cartItem) => ({
        equipment_id: cartItem.equipmentId,
        amount: cartItem.amount,
    }));

    const order = await prisma.order.create({
        data: {
            user_id: cart.userId,
            return_date:data.date,
            OrderedEquipment: {
                createMany: {
                    data: equipment,
                },
            },
        },
        include: { OrderedEquipment: true },
    });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.delete({ where: { id: cart.id } });

    await prisma.$disconnect();

    return new Response(JSON.stringify(order));
};



export {handler as POST}