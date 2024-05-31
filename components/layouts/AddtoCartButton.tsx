'use client'
import { CartLengthAtom } from '@/lib/RecoilContextProvider';
import { AddProductInCart } from '@/ServerActions/AddProductInCart';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Button } from '../ui/AcertinityButton';

const AddtoCartButton = ({ ProductID }: { ProductID: string }) => {
    const [clicked, setClicked] = useState(false);
    const [CartLength, setCartLength] = useRecoilState(CartLengthAtom);

    useEffect(() => {
        // Initialize CartLength from local storage when component mounts
        const storedCartLength = localStorage.getItem('CartLength');
        if (storedCartLength) {
            setCartLength(parseInt(storedCartLength, 10));
        }
    }, []); // Run this effect only once when the component mounts

    async function handleClick() {
        setClicked(true);
        setCartLength(prev => prev + 1);
        await AddProductInCart(ProductID);
        setTimeout(() => {
            setClicked(false);
        }, 500);

        // Store the updated CartLength value in local storage
        localStorage.setItem('CartLength', String(CartLength + 1));
    }

    return (
        <div className='mb-7'>
            <Button
                className={`mx-auto ${clicked ? ' animate-bounce' : ''}`}
                onClick={handleClick}
            >
                Add to Cart
            </Button>
        </div>
    );
};

export default AddtoCartButton;
