import {NextRequest} from "next/server";
import {PrismaClient} from "@prisma/client";


const handler = async (req: NextRequest, params: any) => {
    const data: { user_id: number } = await (req.json())
    const prisma = new PrismaClient();
    const cart = await prisma.cart.findFirst({
        where: { userId: data.user_id },
        select: {
            id: true,
            cartItems: {
                select: {
                    id: true,
                    amount: true,
                    equipment: {
                        select: {
                            id: true,
                            name: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    await prisma.$disconnect();
    return new Response(JSON.stringify(cart))
}

const put_handler = async (req: NextRequest, params: any) => {
    const data: { id: number, name: string, amount: number, price: number, user_id:number } = await (req.json())
    const prisma = new PrismaClient();
    let cart = await prisma.cart.findFirst({
        where: {userId: params.userId} // Assuming you have the user's ID available in the 'params' object
    });

    if (!cart) {
        cart = await prisma.cart.create({data:{userId:data.user_id}})
    }

    // Create a new cart item associated with the equipment and cart
    const cartItem = await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            equipmentId: data.id,
            amount: data.amount // Assuming you want to add 1 quantity of the item
        }
    });
    await prisma.equipment.update({where:{id:data.id}, data:{amount:{decrement:data.amount}}})

    await prisma.$disconnect();


    await prisma.$disconnect();
    return new Response()
}




export {handler as GET, handler as POST, put_handler as PUT}