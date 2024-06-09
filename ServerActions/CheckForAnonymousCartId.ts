"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function CheckForAnonymousCartId() {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();
  const anonymousId = cookieStore.get("anonymousId")?.value;
  if (!anonymousId) {
    return null;
  }
  if (!user) {
    const anonymousCart = await prisma.cart.findFirst({
      where: {
        anonymousId: anonymousId,
      },
    });
    if (anonymousCart) {
      cookieStore.set("anonymousCartId", anonymousCart.id);
      return anonymousCart.id;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
