"use server";
import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function GetCartDetails() {
  const session = await getServerSession();
  const user: User | null = session?.user;
  const cookieStore = cookies();
  const anonymousId = cookieStore.get("anonymousId")?.value;

  try {
    // Fetch all active carts for the user or anonymous ID, ordered by creation date
    const cartDetails = await prisma.cart.findMany({
      where: {
        OR: [{ userId: user?.id }, { anonymousId: anonymousId! }],
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        CartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get the most recent active cart
    const mostRecentCart = cartDetails.length > 0 ? cartDetails[0] : null;

    if (mostRecentCart) {
      // Convert Prisma Decimal to plain JavaScript numbers
      const plainCartDetails = {
        ...mostRecentCart,
        CartItem: mostRecentCart.CartItem.map((item) => ({
          ...item,
          product: {
            ...item.product,
            price: item.product.price.toNumber(), // Convert Decimal to number
          },
        })),
      };
      revalidatePath("/");
      return plainCartDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error in getting CartDetails from server", error);
    return null;
  }
}
