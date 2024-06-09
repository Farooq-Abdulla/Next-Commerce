import getServerSession from "@/lib/getServerSession";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

const OrdersPage = async () => {
    const session = await getServerSession();
    const user = session?.user

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl">No user found.</h2>
            </div>
        );
    }

    const orders = await prisma.order.findMany({
        where: {
            cart: {
                userId: user.id,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            cart: {
                include: {
                    CartItem: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    if (!orders.length) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl">No orders found.</h2>
            </div>
        );
    }

    return (
        <div className="h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="container mx-auto flex flex-col items-center justify-center space-y-8 p-6">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-7xl font-bold dark:text-white text-black mb-4">Order Details</h1>
                </div>
                {orders.map((order) => (
                    <div key={order.id} className="bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-8 mb-8 w-full cursor-pointer">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                                <p><strong>Order ID:</strong> {order.id}</p>
                                <p><strong>Order Date:</strong> {format(new Date(order.createdAt), 'PPP')}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <p><strong>Total Amount:</strong> ${(order.amount / 100).toFixed(2)}</p>
                                <p><strong>Billing Name:</strong> {order.billingName}</p>
                                <p><strong>Billing Email:</strong> {order.billingEmail}</p>
                                <p><strong>Shipping Address:</strong> {order.shippingName}, {order.shippingAddress}, {order.shippingCity}, {order.shippingState}, {order.shippingZip}, {order.shippingCountry}</p>
                                {order.receiptUrl && <p><strong>Receipt:</strong> <Link href={order.receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</Link></p>}
                            </div>
                            <div className="md:col-span-1">
                                <h3 className="text-xl font-bold mb-4">Items</h3>
                                {order.cart.CartItem.map((item) => (
                                    <Link href={`/${item.productId}`} key={item.id}><div key={item.id} className="flex mb-4 border-b pb-4">
                                        <Image
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            height="80"
                                            width="80"
                                            className="rounded-lg object-cover"
                                            priority={false}
                                        />
                                        <div className="ml-4">
                                            <p className="text-lg font-bold">{item.product.name}</p>
                                            <p className="text-sm">Quantity: {item.quantity}</p>
                                            <p className="text-sm">Price: ${(Number(item.product.price) / 100).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                                <div className="text-lg font-mono mb-2">Total Price: ${(order.amount / 100).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
