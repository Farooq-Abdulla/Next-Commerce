'use client'
import React from 'react'
import { atom, RecoilRoot } from "recoil"

const RecoilContextProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}

export const CartLengthAtom = atom({
    key: 'CartLengthAtom',
    default: 0
});



export default RecoilContextProvider