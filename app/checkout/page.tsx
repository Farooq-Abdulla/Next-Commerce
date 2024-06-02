import CheckOutForm from "@/components/layouts/CheckOutForm";
import { NullCart } from "@/components/layouts/NullCart";
import getServerSession from "@/lib/getServerSession";
import { GetCartDetails } from "@/ServerActions/GetCartDetails";
import { GetCartLength_Server } from "@/ServerActions/GetCartLength_Server";
import { redirect } from "next/navigation";

export default async function ChecKOutPage() {
    const session = await getServerSession()
    const user = session?.user;
    if (!user) {
        redirect('/api/auth/signin?callbackUrl=/checkout')
    }
    const cartDetails = await GetCartDetails();
    const { totalCartCost } = await GetCartLength_Server()
    if (cartDetails === null) {
        return <NullCart />
    }
    if (cartDetails.CartItem.length === 0) {
        return <NullCart />
    }
    return (
        <div>
            <CheckOutForm cartDetails={cartDetails} totalCartCost={totalCartCost} />
        </div>
    )
}