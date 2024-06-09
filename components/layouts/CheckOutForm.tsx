'use client'

import { Button } from '@/components/ui/AcertinityButton';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cart, CartItem } from '@prisma/client';
import {
    AddressElement,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe
} from "@stripe/react-stripe-js";
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import { CreateOrder } from '@/ServerActions/CreateOrder';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Stripe from "stripe";
import { ButtonShadcn } from '../ui/button';
import { ToastAction } from '../ui/toast';
import { useToast } from '../ui/use-toast';


const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'Zip code is required'),
    // cardNumber: z.string().min(16, 'Card number is required'),
    // expiry: z.string().min(5, 'Expiry date is required'),
    // cvv: z.string().min(3, 'CVV is required'),
});

interface Props {
    totalCartCost: number;
    cartDetails: Cart & { CartItem: (CartItem & { product: any })[] };
    clientSecret: string;
}


const CheckOutForm = ({ totalCartCost, cartDetails, clientSecret }: Props) => {
    const mainStripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    //   useEffect(() => {
    //     if (!stripe) {
    //       return;
    //     }


    //     if (!clientSecret) {
    //       return;
    //     }
    //   stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //     switch (paymentIntent.status) {
    //       case "succeeded":
    //         setMessage("Payment succeeded!");
    //         break;
    //       case "processing":
    //         setMessage("Your payment is processing.");
    //         break;
    //       case "requires_payment_method":
    //         setMessage("Your payment was not successful, please try again.");
    //         break;
    //       default:
    //         setMessage("Something went wrong.");
    //         break;
    //     }
    //   });
    // }, [stripe]);
    // const { data: session, status } = useSession();
    // const router = useRouter();

    // useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         router.push("/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");
    //     }
    // }, [status, router]);
    // const [cartDetails, setCartDetails] = useState<Cart & { CartItem: (CartItem & { product: any })[] } | null>(null);
    // const [totalPrice, setTotalPrice] = useState(0);

    const form = useForm({
        resolver: zodResolver(formSchema)
    });

    // useEffect(() => {
    //     const fetchCartDetails = async () => {
    //         const details = await GetCartDetails();
    //         const { totalCartCost } = await GetCartLength_Server();
    //         if (details && totalCartCost) {
    //             setCartDetails(details);
    //             setTotalPrice(totalCartCost);
    //         } else {
    //             setCartDetails(null);
    //             setTotalPrice(0);
    //         }
    //     };

    //     fetchCartDetails();
    // }, []);

    // if (!cartDetails) {
    //     return <Loading />;
    // }

    // if (cartDetails.CartItem.length === 0) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen">
    //             <h2>Your cart is empty.</h2>
    //         </div>
    //     );
    // }

    const onSubmit = async (event: any) => {
        event.preventDefault();
        console.log("In submit event")
        // Add your checkout logic here
        // console.log('Proceeding to checkout...', data);
        // form.reset();
        if (!email) {
            console.log("No email ")
            return
        } else {
            console.log(email)
        }

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);
        console.log("Before confirmPayment")

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/orders",
                receipt_email: email
            },
            redirect: "if_required"
        });
        console.log("After confirmPayment")
        // const PaymentObject = await stripe.retrievePaymentIntent(clientSecret)
        // console.log(result)
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (result.error) {
            console.log(result.error)
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your payment.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        } else {
            await CreateOrder(result, cartDetails.id)
            // console.log(clientSecret)
            toast({
                variant: "default",
                title: "Success!",
                description: "Your payment was successful.",
                // action: <ToastAction altText="Go back">Go back</ToastAction>,
            })
            router.push("/orders")
        }

        setIsLoading(false);

    };

    return (
        <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8"></div>

            <div className="container mx-auto flex flex-col items-center justify-center space-y-8 p-6" >
                {/* <div className="flex justify-center mt-3">
                        <Button type="submit" className="mb-4" onSubmit={onSubmit}>Place Order</Button>
                    </div>  */}
                <div className="text-center">
                    <h1 className="text-4xl sm:text-7xl font-bold dark:text-white text-black mb-4">Checkout</h1>
                    <p className="text-lg dark:text-gray-300 text-gray-700">Complete your purchase by providing your payment details below.</p>
                </div>
                <TracingBeam className="px-4">
                    <div className=" rounded-lg p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <div className="flex justify-center">
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <Button className="mt-3">Place Order</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] text-white h-full  overflow-y-scroll ">
                                            <DialogHeader>
                                                <DialogTitle>Place Order</DialogTitle>
                                                <DialogDescription>Make an Order here</DialogDescription>
                                            </DialogHeader>
                                            <PaymentElement className="text-white rounded-2xl" />
                                            <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
                                            <AddressElement options={{
                                                mode: 'shipping',
                                                allowedCountries: ["US"],
                                                autocomplete: {
                                                    mode: 'automatic'
                                                },
                                            }} />
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <ButtonShadcn type="button" className='my-2'>Close</ButtonShadcn>
                                                </DialogClose>
                                                <ButtonShadcn onClick={onSubmit} disabled={isLoading} className='my-2'>Pay</ButtonShadcn>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                                {cartDetails.CartItem.map((item) => (
                                    <Link href={`/${item.productId}`} key={item.id}><div key={item.id} className="mb-6 flex cursor-pointer">
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            height="80"
                                            width="80"
                                            className="rounded-lg object-cover"
                                            priority={false}
                                        />
                                        <div className="ml-4">
                                            <p className="text-sm font-bold dark:text-white text-black">{item.product.name}</p>
                                            <p className="text-sm dark:text-white text-black">Quantity: {item.quantity}</p>
                                            <p className="text-sm dark:text-white text-black">Price: ${Number(item.product.price)}</p>
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                                <div className="text-lg font-mono mb-2">Total Price: ${totalCartCost.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </TracingBeam>
            </div>

        </div>
    );
};

export default CheckOutForm;

