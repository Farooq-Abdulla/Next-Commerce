'use client'
import favicon from "@/app/favicon.ico";
import { signIn, useSession } from "next-auth/react";
// import { signIn } from "@/auth";
import { CheckForCartId } from "@/ServerActions/CheckForCartId";
import { MergeCarts } from "@/ServerActions/UpdateUserIdInCartId";
import { ShoppingCart } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from "react";
import { Button } from '../ui/button';
import PageTheme from "./PageTheme";
import UserButton from './UserButton';


const NavBar = () => {
    const session = useSession();
    const user = session.data?.user;

    useEffect(() => {
        const updateUserCart = async () => {
            if (user) {
                await MergeCarts()
            }
        };

        if (session.status === "authenticated") {
            updateUserCart();
        }
    }, [session.status, user]);

    return (
        <div className="sticky top-1 z-40  ">
            <div className='border-b-current  text-current bg-slate-950 mx-64 mt-2 flex justify-around shadow items-center sticky z-50  rounded-full  '>
                <div className='flex space-x-3 items-center cursor-pointer'>
                    <Image src={favicon} alt='Logo' width={50} height={50} />
                    <Link href={'/'} className='text-pretty text-white text-lg hover:text-slate-400'>NextCommerce</Link>

                </div>
                <div className="flex space-x-4 items-center cursor-pointer">
                    <PageTheme />
                    <Link href={'/'} className='text-pretty text-white text-lg hover:text-slate-400'><ShoppingCart /></Link>
                    <div>
                        {user && <UserButton user={user} />}
                        {!user && session.status !== "loading" && <SignInButton />}
                        {/* {user ? <UserButton user={user} /> : <SignInButton />} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar

// function SignInButton() {
//     return (
//         <form
//             action={async () => {
//                 "use server";
//                 await signIn();
//             }}
//         >
//             <Button type="submit">Sign in</Button>
//         </form>
//     );
// }

function SignInButton() {

    return (
        <>

            <Button onClick={async () => {
                await CheckForCartId()
                signIn()
            }}>Sign in</Button>
        </>
    )
}