'use client'
import favicon from "@/app/favicon.ico";
import { signIn, useSession } from "next-auth/react";
// import { signIn } from "@/auth";
import { CartLengthAtom } from "@/lib/RecoilContextProvider";
import { CheckForAnonymousCartId } from "@/ServerActions/CheckForAnonymousCartId";
import { GetCartLength_Server } from "@/ServerActions/GetCartLength_Server";
import { MergeCarts } from "@/ServerActions/MergeCarts";
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

    // useEffect(() => {
    //     // Load CartLength from localStorage on component mount
    //     const storedCartLength = localStorage.getItem('CartLength');
    //     if (storedCartLength !== null) {
    //         setCartLength(parseInt(storedCartLength, 10));
    //     }
    // }, []);

    // useEffect(() => {
    //     const updateUserCart = async () => {
    //         if (user) {
    //             await MergeCarts()
    //             const totalCartLength = await GetCartLength_Server(); // Fetch updated cart length
    //             console.log(totalCartLength)
    //             setCartLength(totalCartLength); // Update state with fetched cart length
    //             localStorage.setItem('CartLength', String(totalCartLength));
    //         }
    //     };

    //     if (session.status === "authenticated") {
    //         updateUserCart();
    //     }
    //     if (session.status === 'unauthenticated') {
    //         localStorage.removeItem('CartLength')
    //         setCartLength(0)

    //     }
    // }, [session.status, user]);

    useEffect(() => {
        const updateUserCart = async () => {
            if (user) {
                await MergeCarts()
                const { totalCartLength } = await GetCartLength_Server(); // Fetch updated cart length
                // console.log(totalCartLength)
                setCartLength(totalCartLength); // Update state with fetched cart length
                // localStorage.setItem('CartLength', String(totalCartLength));
                return
            }
        };

        if (session.status === "authenticated") {
            updateUserCart();
        }
        // if (session.status === 'unauthenticated') {
        //     // localStorage.removeItem('CartLength')
        //     setCartLength(0)

        // }
        const something = async () => {
            console.log("In something")
            const { totalCartLength } = await GetCartLength_Server();
            console.log(totalCartLength)
            setCartLength(totalCartLength)
        }
        something()
    })




    return (
        <div className="sticky top-1 z-40 flex justify-center ">
            <div className='border-b-current  text-current bg-slate-950 w-96 mt-2 flex justify-around shadow items-center sticky z-50  rounded-full  '>
                <Link href={'/'}><div className='flex space-x-3 items-center cursor-pointer'>
                    <Image src={favicon} alt='Logo' width={50} height={50} />
                    <p className='text-pretty text-white text-lg hover:text-slate-400 font-mono'>NextCommerce</p>

                </div></Link>
                <div className="flex space-x-4 items-center cursor-pointer md:visible">
                    <PageTheme />
                    <span onClick={() => { router.push("/cart"), router.refresh() }} className='text-pretty text-white text-lg hover:text-slate-400 relative'><ShoppingCart className="" />
                        <span className="absolute top-0 left-1/2 -mt-1/2 -ml-0 flex items-center justify-center w-3 h-3  text-xs p-2 text-red-800 bg-white rounded-full">
                            {CartLength}
                        </span> </span>
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
                await CheckForAnonymousCartId()
                signIn()
            }}>Sign in</Button>
        </>
    )
}