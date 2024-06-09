'use client'
import CheckOutForm from '@/components/layouts/CheckOutForm';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckOutClient = ({ clientSecret, options, cartDetails, totalCartCost }: { clientSecret: string, options: { clientSecret: string }, cartDetails: any, totalCartCost: number }) => {
    const router = useRouter()
    router.refresh()
    return (
        <div>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckOutForm cartDetails={cartDetails} totalCartCost={totalCartCost} clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    )
}

export default CheckOutClient