'use server'

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DecreaseProductQuantity(itemId: string, cardId: string) {
    try {
        await prisma.cartItem.update({
            where: {
                id: itemId,
                cartId: cardId,
            },
            data: {
                quantity: {
                    decrement: 1,
                },
            },
        });
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cardId,
                quantity: 0,
            },
        })
        revalidatePath("/cart")
    } catch (error: any) {
        console.log("Error decreasing product quantity ", error);
    }
}