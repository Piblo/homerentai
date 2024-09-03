import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth } from "@/server/auth";
import { cn } from "@/lib/utils";
import { db } from "@/server/database/connection";
import { descriptions } from "@/server/database/schema";
import { eq } from "drizzle-orm";

type Props = {
  className?: string;
};

export async function DescriptionList({ className }: Props) {
  const session = await auth();
  const generatedDescriptions = await db.query.descriptions.findMany({
    where: eq(descriptions.userId, session?.user?.id!),
  });

  return (
    <div className={cn("max-w-[400px]", className)}>
      <Button asChild className="mb-4">
        <Link href="/descriptions">
          <Sparkles size={16} className="mr-2" />
          Generate new
        </Link>
      </Button>
      <ul className="space-y-4">
        {generatedDescriptions.map((description) => (
          <li key={description.id}>
            <Link href={`/descriptions/${description.id}`} className="group">
              <Card className="group-hover:bg-muted group-focus:bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {description.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="line-clamp-1 md:line-clamp-2">
                    {description.text}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
