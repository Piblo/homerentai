import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { auth, signOut } from "@/server/auth";

import { Button } from "./ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";

export async function Nav() {
  const session = await auth();
  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <nav className="py-4 px-6 flex items-center justify-between">
      <ul>
        <li>
          <Link className="font-bold" href="/">
            Home Rent AI
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-4">
        <li>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </Link>
        </li>
        {session?.user && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="size-8">
                    {session.user.image && (
                      <AvatarImage src={session.user.image} />
                    )}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <DropdownMenuItem>
                    <button
                      type="submit"
                      className="flex items-center cursor-pointer w-full"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}
      </ul>
    </nav>
  );
}
