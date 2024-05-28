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
        <div className="w-full mt-8  flex ">
            <div className="w-1/2 flex justify-center items-center mx-5">
                <Image src={`${Product?.imageUrl}`} alt="Image" width={900} height={900} className="rounded-2xl" />
                {/* <p>{Product?.imageUrl}</p> */}
            </div>
            <div className="w-1/2 ml-10 text-wrap mx-5">
                <h1 className="text-5xl font-serif font-extrabold mb-14">{Product?.name}</h1>
                <p className="text-lg font-mono mb-10" >{Product?.description}</p>
                <p>{Number(Product?.price)}</p>
            </div>
        </div>
    )
}

export default ProductID