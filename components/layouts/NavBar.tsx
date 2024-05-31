'use client'
import favicon from "@/app/favicon.ico";
import { signIn, useSession } from "next-auth/react";
// import { signIn } from "@/auth";
import { CartLengthAtom } from "@/lib/RecoilContextProvider";
import { CheckForCartId } from "@/ServerActions/CheckForCartId";
import { UpdateCartIcon } from "@/ServerActions/UpdateCartIcon";
import { MergeCarts } from "@/ServerActions/UpdateUserIdInCartId";
import { ShoppingCart } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Button } from '../ui/button';
import PageTheme from "./PageTheme";
import UserButton from './UserButton';


const NavBar = () => {
    const session = useSession();
    const user = session.data?.user;
    const router = useRouter()
    const [CartLength, setCartLength] = useRecoilState(CartLengthAtom);

    useEffect(() => {
        // Load CartLength from localStorage on component mount
        const storedCartLength = localStorage.getItem('CartLength');
        if (storedCartLength !== null) {
            setCartLength(parseInt(storedCartLength, 10));
        }
    }, []);

    useEffect(() => {
        const updateUserCart = async () => {
            if (user) {
                await MergeCarts()
                const totalCartLength = await UpdateCartIcon(); // Fetch updated cart length
                console.log(totalCartLength)
                setCartLength(totalCartLength); // Update state with fetched cart length
                localStorage.setItem('CartLength', String(totalCartLength));
            }
        };

        if (session.status === "authenticated") {
            updateUserCart();
        }
        if (session.status === 'unauthenticated') {
            localStorage.removeItem('CartLength')
            setCartLength(0)

        }
    }, [session.status, user]);




    return (
        <div className="sticky top-1 z-40 flex justify-center ">
            <div className='border-b-current  text-current bg-slate-950 w-96 mt-2 flex justify-around shadow items-center sticky z-50  rounded-full  '>
                <Link href={'/'}><div className='flex space-x-3 items-center cursor-pointer'>
                    <Image src={favicon} alt='Logo' width={50} height={50} />
                    <p className='text-pretty text-white text-lg hover:text-slate-400 font-mono'>NextCommerce</p>

                </div></Link>
                <div className="flex space-x-4 items-center cursor-pointer md:visible">
                    <PageTheme />
                    <Link href={'/'} className='text-pretty text-white text-lg hover:text-slate-400 relative'><ShoppingCart className="" />
                        <span className="absolute top-0 left-1/2 -mt-1/2 -ml-0 flex items-center justify-center w-3 h-3  text-sm p-2 text-red-800 bg-white rounded-full">
                            {CartLength}
                        </span> </Link>
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

            <Button className="rounded-3xl" onClick={async () => {
                await CheckForCartId()
                signIn()
            }}>Sign in</Button>
        </>
    )
}