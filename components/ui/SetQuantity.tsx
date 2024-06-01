'use client'
import { DecreaseProductQuantity } from "@/ServerActions/DecreaseProductQuantity";
import { IncreaseProductQuantity } from "@/ServerActions/IncreaseProductQuantity";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./AcertinityButton";

export function SetQuantity({ quantity, itemId, cartId }: { quantity: number, itemId: string, cartId: string }) {
    const router = useRouter()
    const incrementQuantiy = async () => {
        await IncreaseProductQuantity(itemId, cartId)
        window.location.reload();
        // router.refresh()
    }
    const decrementQuantiy = async () => {
        await DecreaseProductQuantity(itemId, cartId)
        window.location.reload()
    }
    return (
        <div className="ml-1">
            <Button><Minus className={`size-2 mr-2 ${quantity === 0 ? 'hidden' : ''}`} onClick={() => decrementQuantiy()} /> {quantity} <Plus className="size-2 ml-2" onClick={() => incrementQuantiy()} /></Button>
        </div>
    )
}