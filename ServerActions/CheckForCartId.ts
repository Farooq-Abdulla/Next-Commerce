"use server";

import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function CheckForCartId() {
  const session = await getServerSession();
  const user = session?.user;
  const cookieStore = cookies();
  const anonymousId = cookieStore.get("anonymousId")?.value;
  if (!anonymousId) {
    return null;
  }
  if (!user) {
    const anonymousCartId = await prisma.cart.findUnique({
      where: {
        anonymousId: anonymousId,
      },
    });
    if (anonymousCartId) {
      cookieStore.set("anonymousCartId", anonymousCartId.id);
      return anonymousCartId.id;
    } else {
      return null;
    }
  }
}
