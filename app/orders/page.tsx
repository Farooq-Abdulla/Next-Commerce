import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const OrdersPage = async () => {
    const cookieStore = cookies();
    const orderId = cookieStore.get('orderId')?.value;

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
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

    if (!order) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <h2 className="text-2xl">No order found.</h2>
            </div>
        );
    }

    const { cart, createdAt, amount, status, billingName, billingEmail, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry, receiptUrl } = order;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Order Details</h1>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Order Date:</strong> {format(new Date(createdAt), 'PPP')}</p>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Total Amount:</strong> ${(amount / 100).toFixed(2)}</p>
                <p><strong>Billing Name:</strong> {billingName}</p>
                <p><strong>Billing Email:</strong> {billingEmail}</p>
                <p><strong>Shipping Address:</strong> {shippingName}, {shippingAddress}, {shippingCity}, {shippingState}, {shippingZip}, {shippingCountry}</p>
                {receiptUrl && <p><strong>Receipt:</strong> <Link href={receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</Link></p>}
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Items</h2>
                {cart.CartItem.map((item) => (
                    <div key={item.id} className="flex mb-4 border-b pb-4">
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
                            <p className="text-sm">Price: ${(item.product.price / 100).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
