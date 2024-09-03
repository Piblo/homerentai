"use client";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { Button } from "./ui/button";
import { DescriptionList } from "./DescriptionList";
import Link from "next/link";
import { Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useState } from "react";

export function Nav() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <nav className="py-4 px-6 flex items-center justify-between">
      <ul>
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
        <li className="hidden lg:block">
          <Link className="font-bold" href="/">
            Home Rent AI
          </Link>
        </li>
      </ul>
      <ul className="flex items-center gap-4">
        <UserMenu />
      </ul>
    </nav>
  );
}
