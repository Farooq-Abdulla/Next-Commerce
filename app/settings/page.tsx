
import { Metadata } from "next";
import { redirect } from "next/navigation";

import getServerSession from "@/lib/getServerSession";

export const metadata: Metadata = {
    title: "Settings",
};

export default async function Page() {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
        redirect("/api/auth/signin?callbackUrl=/settings");
    }

    return (
        <main className="mx-auto my-10 space-y-3">
            <h1 className="text-center text-xl font-bold">Hi {user.name}</h1>
            <p className="text-center">Welcome to Settings Page!</p>
        </main>
    );
}