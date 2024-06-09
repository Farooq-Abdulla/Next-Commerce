import avatarPlaceholder from "@/public/Avatar Placeholder.png";
import { Lock, LogOut, PackageOpen, Settings } from "lucide-react";
import { User } from "next-auth";

// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { ButtonShadcn } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserButtonProps {
    user: User;
}

export default function UserButton({ user }: UserButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ButtonShadcn size="icon" className="flex-none rounded-full">
                    <Image
                        src={user.image || avatarPlaceholder}
                        alt="User profile picture"
                        width={50}
                        height={50}
                        className="aspect-square rounded-full bg-background object-cover"
                    />
                </ButtonShadcn>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Hi {user.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                            <PackageOpen className="mr-2 h-4 w-4" />
                            <span>Orders</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    {user.role === "ADMIN" && (
                        <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                                <Lock className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    {/* <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <button type="submit" className="flex w-full items-center cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </button>
                    </form> */}
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center"
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}