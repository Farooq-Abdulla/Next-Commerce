import { InputForm } from "@/components/layouts/AdminForm";
import getServerSession from "@/lib/getServerSession";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin",
};

export default async function Page() {
    const session = await getServerSession()
    const user = session?.user;

    if (!user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    if (user.role !== "ADMIN") {
        return (
            <main className="mx-auto my-10">
                <p className="text-center">You are not authorized to view this page</p>
            </main>
        );
    }

    return (
        <main className="mx-auto my-10 space-y-3">
            <h1 className="text-center text-xl font-bold">Admin Page</h1>
            <p className="text-center">Welcome, admin!</p>
            <div className="flex justify-center items-center">
                <InputForm />
            </div>
        </main>
    );
}