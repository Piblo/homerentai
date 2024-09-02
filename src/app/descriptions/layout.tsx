import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/server/auth";
import { db } from "@/server/database/connection";
import { descriptions } from "@/server/database/schema";
import { eq } from "drizzle-orm";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const session = await auth();
  const generatedDescriptions = await db.query.descriptions.findMany({
    where: eq(descriptions.userId, session?.user?.id!),
  });

  return (
    <main className="flex px-6">
      {generatedDescriptions.length > 0 && (
        <div>
          <Button asChild className="mb-4">
            <Link href="/descriptions">
              <Plus size={16} />
              Generate new
            </Link>
          </Button>
          <ul className="max-w-[400px] space-y-4 mr-6">
            {generatedDescriptions.map((description) => (
              <li key={description.id}>
                <Link
                  href={`/descriptions/${description.id}`}
                  className="group"
                >
                  <Card className="group-hover:bg-muted group-focus:bg-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {description.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {description.text.slice(0, 80) + "..."}
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </main>
  );
}
