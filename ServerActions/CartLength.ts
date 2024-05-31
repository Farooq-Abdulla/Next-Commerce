"use server";

import { cookies } from "next/headers";

export async function GetCartLength() {
  const cookieStore = cookies();
  const CartLength = cookieStore.get("CartLength")?.value;
  return CartLength;
}
