"use client";

import { House, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { signIn, useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { DescriptionList } from "./DescriptionList";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { useState } from "react";

export function Nav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const session = useSession();

  return (
    <nav className="py-4 px-6 flex items-center justify-between">
      <ul className="flex gap-2 items-center">
        {session.status === "authenticated" && (
          <li className="lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <DescriptionList
                  onDescriptionClick={() => setSheetOpen(false)}
                  onGenerateNewClick={() => setSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </li>
        )}
        <li>
          <Link className="font-bold flex gap-2" href="/">
            <House className="hidden lg:block" />
            Home Rent AI
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-6">
        <li className="hidden lg:block">
          <Button className="p-0" asChild variant="link">
            <Link href="/descriptions">My descriptions</Link>
          </Button>
        </li>
        <li>
          <Button className="p-0" asChild variant="link">
            <Link href="/pricing">Pricing</Link>
          </Button>
        </li>
        {session.status === "unauthenticated" && (
          <li>
            <Button
              variant="link"
              onClick={() =>
                signIn(undefined, { callbackUrl: "/descriptions" })
              }
            >
              Sign in
            </Button>
          </li>
        )}
        {session.status === "authenticated" && (
          <>
            <li>
              <UserMenu />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
