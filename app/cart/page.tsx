


import { CheckOutButton } from '@/components/layouts/CartClientComp';
import { NullCart } from '@/components/layouts/NullCart';
import { SetQuantity } from '@/components/ui/SetQuantity';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { GetCartDetails } from '@/ServerActions/GetCartDetails';
import { GetCartLength_Server } from '@/ServerActions/GetCartLength_Server';
import { RemoveProductFromCart } from '@/ServerActions/RemoveProductFromCart';
import { revalidatePath } from 'next/cache';


import Image from 'next/image';

import { twMerge } from "tailwind-merge";

const CartComponent = async () => {
    revalidatePath("/")


    // const [cartDetails, setCartDetails] = useState<Cart & { CartItem: (CartItem & { product: any })[] } | null>(null);
    // const [totalPrice, setTotalPrice] = useState(0)



    const cartDetails = await GetCartDetails();
    const { totalCartCost } = await GetCartLength_Server()

    // useEffect(() => {
    //     const fetchCartDetails = async () => {
    //         const details = await GetCartDetails();
    //         const { totalCartCost } = await GetCartLength_Server()
    //         if (details && totalCartCost) {
    //             setCartDetails(details);
    //             setTotalPrice(totalCartCost)
    //         } else {
    //             setCartDetails(null);
    //             setTotalPrice(0)
    //         }
    //     };

    //     fetchCartDetails();
    // }, []);
    // useEffect(() => {
    //     if (shouldRefresh) {

    //     }
    // }, [shouldRefresh, router]);


    // if (!cartDetails) {
    //     return <Loading />;
    // }
    if (cartDetails === null) {
        return <NullCart />
    }
    if (cartDetails.CartItem.length === 0) {
        return <NullCart />
    }



    const RemoveFromCart = async (itemId: string, cartId: string) => {
        await RemoveProductFromCart(itemId, cartId);

    };


    return (

        <div className="h-fit w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8"></div>

            <div className="container h-fit mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Cart total ${totalCartCost.toFixed(2)} </h2>
                <div className="flex justify-center">
                    <CheckOutButton />
                </div>

                <TracingBeam className="px-6">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">

                        {cartDetails?.CartItem.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((item) => (
                            <div key={item.id} className="mb-10">
                                <div className='flex justify-between items-center'>
                                    <p className={twMerge("text-xl mb-4 font-mono font-bold dark:text-white text-black")}>
                                        {item.product.name}
                                    </p>
                                    {/* <RemoveFromCartButton onClick={() => RemoveFromCart(item.id, item.cartId)} /> */}
                                </div>

                                <div className="text-sm  prose prose-sm dark:prose-invert">

                                    <Image
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        height="1000"
                                        width="1000"
                                        className="rounded-lg mb-10 object-cover"
                                        priority={false}
                                    />

                                    <p className="dark:text-white text-black font-mono text-lg mb-2">{item.product.description}</p>
                                    <p className="text-lg font-mono mb-2">Price: ${Number(item.product.price)}</p>
                                    <div className="text-lg font-mono flex items-center  ">Quantity: <SetQuantity quantity={item.quantity} cartId={item.cartId} itemId={item.id} /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <CheckOutButton />
                    </div>
                </TracingBeam>
            </div>

        </div>
    );
};

export default CartComponent;


