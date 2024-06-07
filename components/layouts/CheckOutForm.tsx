'use client'

import { Button } from '@/components/ui/AcertinityButton';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cart, CartItem } from '@prisma/client';
import {
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

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { useState } from 'react';
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
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false)
    const { toast } = useToast()

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

    const onSubmit = async (data: any) => {
        // Add your checkout logic here
        console.log('Proceeding to checkout...', data);
        // form.reset();

        if (!stripe || !elements || !email) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000",
                receipt_email: email,
            },
            redirect: "if_required"
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your payment.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        } else {
            toast({
                variant: "default",
                title: "Success!",
                description: "Your payment was successful.",
                // action: <ToastAction altText="Go back">Go back</ToastAction>,
            })
        }

        setIsLoading(false);

    };

    return (
        <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8"></div>
            <div className="" suppressHydrationWarning>
                <div className="container mx-auto " >
                    {/* <div className="flex justify-center mt-3">
                        <Button type="submit" className="mb-4" onSubmit={onSubmit}>Place Order</Button>
                    </div>  */}
                    <TracingBeam className="px-6">
                        <Form {...form}  >
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="md:col-span-2 font-mono">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            {/* <Input placeholder="John Doe" {...field} /> */}
                                                            <PlaceholdersAndVanishInput placeholders={["Naruto", "Hashirama", "Madara", "Gaara"]} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            {/* <Input placeholder="123 Main St" {...field} /> */}
                                                            <PlaceholdersAndVanishInput {...field} placeholders={["123 Main St", "19th St", "6th St"]} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="city"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>City</FormLabel>
                                                            <FormControl>
                                                                {/* <Input placeholder="New York" {...field} /> */}
                                                                <PlaceholdersAndVanishInput {...field} placeholders={["New York", "Konaha", "Dallas", "Atlanta"]} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="state"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>State</FormLabel>
                                                            <FormControl>
                                                                {/* <Input placeholder="NY" {...field} /> */}
                                                                <PlaceholdersAndVanishInput {...field} placeholders={["NY", "TX", "CA"]} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="zip"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Zip Code</FormLabel>
                                                            <FormControl>
                                                                {/* <Input placeholder="10001" {...field} /> */}
                                                                <PlaceholdersAndVanishInput {...field} placeholders={["79415", "60102", "59843"]} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="md:col-span-1">
                                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                                        {cartDetails.CartItem.map((item) => (
                                            <div key={item.id} className="mb-6 flex">
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
                                        ))}
                                        <div className="text-lg font-mono mb-2">Total Price: ${totalCartCost.toFixed(2)}</div>
                                    </div>
                                </div>
                                {/* <div className="flex justify-center mt-8">
                                    <Button type="submit" className="mb-4">Place Order</Button>
                                </div> */}
                                {/* <PaymentElement />
                                <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)}  /> */}

                                <div className="flex justify-center mt-3">
                                    <Dialog open={open} onOpenChange={setOpen} >
                                        <DialogTrigger asChild>
                                            <Button className='mt-3'>Place Order</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Edit profile</DialogTitle>
                                                <DialogDescription>
                                                    Make changes to your profile here. Click save when youre done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <PaymentElement />
                                            <DialogFooter className="sm:justify-start">
                                                <DialogClose asChild>
                                                    <ButtonShadcn type="button" >
                                                        Close
                                                    </ButtonShadcn>
                                                </DialogClose>
                                                <ButtonShadcn type='submit' >Pay</ButtonShadcn>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                            </form>
                        </Form>
                    </TracingBeam>
                </div>
            </div>
        </div>
    );
};

export default CheckOutForm;
