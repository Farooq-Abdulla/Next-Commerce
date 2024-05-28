'use client'
import { cn } from "@/lib/utils";
import { GetAllProducts } from "@/ServerActions/GetProducts";
import {
    IconSignature
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";

export type ClientProduct = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
};

export function BentoGridDemo() {
    const router = useRouter()
    const [products, setProducts] = useState<ClientProduct[]>([]);

    useEffect(() => {
        GetAllProducts().then((result) => { setProducts(result); }).catch((error) => {
            console.log(error)
        })
    }, [])
    return (
        <BentoGrid className="max-w-4xl mx-auto cursor-pointer">
            {products.map((product, i) => {
                return (
                    <BentoGridItem
                        key={product.id}
                        title={product.name}
                        description={product.description.split('.')[0] + '...'}
                        header={<Skeleton imageUrl={product.imageUrl} />}
                        className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                        icon={<IconSignature className="h-4 w-4 text-neutral-500" />}
                        onClick={() => router.push(`/${product.id}`)}
                    />
                )
            })}
        </BentoGrid>
    )



}
export const Skeleton = ({ imageUrl }: { imageUrl: string }) => {
    const [loaded, setLoaded] = useState(false);
    return <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
        <Image src={imageUrl} alt="photo" width='500' height='500' className={cn("object-cover h-full w-full", loaded ? "blur-none" : "blur-md")} onLoad={() => setLoaded(true)} />
    </div>
};


// return (
//     <BentoGrid className="max-w-4xl mx-auto">
//         {items.map((item, i) => (
//             <BentoGridItem
//                 key={i}
//                 title={item.title}
//                 description={item.description}
//                 header={item.header}
//                 icon={item.icon}
//                 className={i === 3 || i === 6 ? "md:col-span-2" : ""}
//             />
//         ))}
//     </BentoGrid
// );


// const ite = [
//     {
//         title: "The Dawn of Innovation",
//         description: "Explore the birth of groundbreaking ideas and inventions.",
//         header: <Skeleton />,
//         icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Art of Design",
//         description: "Discover the beauty of thoughtful and functional design.",
//         header: <Skeleton />,
//         icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Power of Communication",
//         description:
//             "Understand the impact of effective communication in our lives.",
//         header: <Skeleton />,
//         icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Pursuit of Knowledge",
//         description: "Join the quest for understanding and enlightenment.",
//         header: <Skeleton />,
//         icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Joy of Creation",
//         description: "Experience the thrill of bringing ideas to life.",
//         header: <Skeleton />,
//         icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Spirit of Adventure",
//         description: "Embark on exciting journeys and thrilling discoveries.",
//         header: <Skeleton />,
//         icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     },
//     {
//         title: "The Digital Revolution",
//         description: "Dive into the transformative power of technology.",
//         header: <Skeleton />,
//         icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
//     }
// ];
