import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

import { Button } from "./ui/button";
import { DescriptionList } from "./DescriptionList";
import Link from "next/link";
import { Menu } from "lucide-react";
import { UserMenu } from "./UserMenu";

export async function Nav() {
  return (
    <nav className="py-4 px-6 flex items-center justify-between">
      <ul>
        <li className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full">
              <DescriptionList />
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
        <UserMenu />
      </ul>
    </nav>
  );
}
