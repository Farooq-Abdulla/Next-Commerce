import { signIn } from '@/auth';
import getServerSession from '@/lib/getServerSession';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import UserButton from './UserButton';

const NavBar = async () => {
    const session = await getServerSession();
    const user = session?.user
    return (
        <div className='border-b border-b-slate-200 flex justify-around items-center cursor-pointer'>
            <div className='flex space-x-3 items-center'>
                <Image src={"/favicon.ico"} alt='Logo' width={50} height={50} />
                <Link href={'/'} className='text-pretty text-lg hover:text-slate-400'>NextCommerce</Link>
            </div>
            <div>
                <div>
                    {user ? <UserButton user={user} /> : <SignInButton />}
                </div>
            </div>
        </div>
    )
}

export default NavBar

function SignInButton() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn();
            }}
        >
            <Button type="submit">Sign in</Button>
        </form>
    );
}