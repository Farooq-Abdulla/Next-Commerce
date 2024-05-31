'use client'
import { AddProductInCart } from '@/ServerActions/AddProductInCart'
import { useState } from 'react'
import { Button } from '../ui/AcertinityButton'

const AddtoCartButton = ({ ProductID }: { ProductID: string }) => {

    const [clicked, setClicked] = useState(false)
    return (
        <div className='mb-7'>

            <Button
                className={`mx-auto ${clicked ? ' animate-bounce' : ''}`}
                onClick={async () => {
                    setClicked(true);
                    await AddProductInCart(ProductID)
                    setTimeout(() => {
                        setClicked(false);
                    }, 500);

                }}
            >Add to Cart</Button>


        </div>
    )
}

export default AddtoCartButton