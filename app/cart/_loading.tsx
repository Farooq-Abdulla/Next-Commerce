// app/cart/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { twMerge } from "tailwind-merge";

export default function Loading() {
    return (
        <div className="h-fit w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8"></div>
            <div className="container h-fit mx-auto p-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>
                <TracingBeam className="px-6">
                    <div className="max-w-2xl mx-auto antialiased pt-4 relative">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="mb-10">
                                <div className='flex justify-between items-center'>
                                    <Skeleton className={twMerge("text-xl mb-4 font-mono font-bold dark:text-white text-black w-36")}>
                                        <Skeleton className="w-36" />
                                    </Skeleton>
                                    <Skeleton className="mb-4 w-24 h-10 rounded-2xl" />
                                </div>
                                <div className="text-sm prose prose-sm dark:prose-invert">
                                    <Skeleton className="rounded-lg mb-10 w-full h-64" />
                                    <Skeleton className="dark:text-white text-black font-mono text-lg mb-2 size-10/12"><Skeleton className="size-[150px]" /></Skeleton>
                                    <div className="text-lg font-mono mb-2 flex items-center">Price: $<Skeleton className="w-10 h-10" /> </div>
                                    <div className="text-lg font-mono flex items-center">Quantity: <Skeleton className="w-10 h-10" /></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TracingBeam>
            </div>
        </div>
    );
}
