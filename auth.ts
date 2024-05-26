import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/favicon.ico",
  },
  adapter: PrismaAdapter(prisma),
  providers: [Google],
});
