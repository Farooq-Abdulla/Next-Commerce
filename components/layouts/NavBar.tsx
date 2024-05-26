'use client'
import favicon from "@/app/favicon.ico";

// import getServerSession from '@/lib/getServerSession';
import { signIn, useSession } from "next-auth/react";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserButton from './UserButton';

const NavBar = () => {
    const session = useSession()
    const user = session.data?.user
    return (
        <div className='border-b border-b-slate-200 flex justify-around items-center cursor-pointer'>
            <div className='flex space-x-3 items-center'>
                <Image src={favicon} alt='Logo' width={50} height={50} />
                <Link href={'/'} className='text-pretty text-lg hover:text-slate-400'>NextCommerce</Link>
            </div>
            <div>
                <div>
                    {user && <UserButton user={user} />}
                    {!user && session.status !== "loading" && <SignInButton />}
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
    return <Button onClick={() => signIn()}>Sign in</Button>;
}