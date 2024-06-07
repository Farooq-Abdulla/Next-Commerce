import { NullCart } from "@/components/layouts/NullCart";
import getServerSession from "@/lib/getServerSession";
import { GetCartDetails } from "@/ServerActions/GetCartDetails";
import { GetCartLength_Server } from "@/ServerActions/GetCartLength_Server";
import { StripeCheckout } from "@/ServerActions/StripeCheckout";
import { redirect } from "next/navigation";
import CheckOutClient from "./random";



export default async function ChecKOutPage() {
    const session = await getServerSession()
    const user = session?.user;
    if (!user) {
        redirect('/api/auth/signin?callbackUrl=/checkout')
    }
    const cartDetails = await GetCartDetails();
    const { totalCartCost } = await GetCartLength_Server()
    const clientSecret = await StripeCheckout(totalCartCost, cartDetails)
    if (cartDetails === null) {
        return <NullCart />
    }
    if (cartDetails.CartItem.length === 0) {
        return <NullCart />
    }

    const options = {
        clientSecret
    };
    return (
        <div>
            <CheckOutClient clientSecret={clientSecret} options={options} cartDetails={cartDetails} totalCartCost={totalCartCost} />

        </div>
    )
}