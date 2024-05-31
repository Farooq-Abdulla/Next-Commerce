
import AddtoCartButton from "@/components/layouts/AddtoCartButton"
import { Button } from "@/components/ui/AcertinityButton"

import { GetProductById } from "@/ServerActions/GetProductById"
import Image from "next/image"

interface Props {
    params: {
        id: string
    }
}
const ProductID = async ({ params: { id } }: Props) => {
    const Product = await GetProductById(id)

    return (



        <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                <Button>Buy Now</Button>
                <div className="w-full mt-5  flex ">
                    <div className="w-1/2 flex justify-center items-center mx-5">
                        <Image src={`${Product?.imageUrl}`} alt="Image" width={900} height={900} className="rounded-2xl cursor-pointer hover:shadow-xl hover:dark:shadow-gray-100 hover:shadow-slate-900" />
                        {/* <p>{Product?.imageUrl}</p> */}
                    </div>
                    <div className="w-1/2 ml-10 text-wrap mx-5">
                        <h1 className=" font-extrabold mb-14 text-slate-800 dark:text-current">{Product?.name}</h1>
                        <p className="text-lg font-mono mb-10 text-slate-800 dark:text-current" >{Product?.description}</p>
                        <AddtoCartButton ProductID={Product?.id!} />
                        {/* <div className="flex items-center mb-7"><span className="text-3xl">Quantity : </span>  <Quantity /></div> */}
                        <p className=" mb-14 text-slate-800 dark:text-current">$ {Number(Product?.price)}</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ProductID


