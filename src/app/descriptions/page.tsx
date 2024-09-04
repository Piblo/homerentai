import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropertyPhotoUpload } from "@/components/PropertyPhotoUpload";
import { auth } from "@/server/auth";
import { db } from "@/server/database/connection";
import { eq } from "drizzle-orm";
import { subscriptions } from "@/server/database/schema";

export default async function Descriptions() {
  const session = await auth();
  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, session?.user?.id!),
  });
  return (
    <div className="max-w-screen-md">
      {subscription?.type === "free" && (
        <Alert role="status" className="mb-4">
          <Info className="size-5" />
          <AlertTitle className="flex justify-between">
            <span>Your subscription</span>
            <Badge>Free plan</Badge>
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              You have <strong>{subscription.remainingDescriptions}</strong>{" "}
              generations left. Consider subscribing to one of our premium plans
              to get more
            </p>
            <Button variant="secondary" asChild>
              <Link href="/pricing">
                <Zap className="size-4 mr-1" /> Upgrade to Pro for unlimited
                generations
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <PropertyPhotoUpload />
    </div>
  );
}
