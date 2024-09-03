"use client";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { signIn, useSession } from "next-auth/react";

import { Button } from "./ui/button";
import { DescriptionList } from "./DescriptionList";
import Link from "next/link";
import { Menu } from "lucide-react";
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
          <Link className="font-bold" href="/">
            Home Rent AI
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-4">
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
          <li>
            <UserMenu />
          </li>
        )}
      </ul>
    </nav>
  );
}
