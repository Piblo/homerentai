"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/database/connection";
import { descriptions } from "@/server/database/schema";
import { eq } from "drizzle-orm";

export async function getUserDescriptions() {
  const session = await auth();
  if (!session) throw new Error("Unauthenticated");

  const generatedDescriptions = await db.query.descriptions.findMany({
    where: eq(descriptions.userId, session?.user?.id!),
  });

  return generatedDescriptions;
}
