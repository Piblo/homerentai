"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/database/connection";
import { descriptions } from "@/server/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserDescriptions() {
  const session = await auth();
  if (!session) throw new Error("Unauthenticated");

  const generatedDescriptions = await db.query.descriptions.findMany({
    where: eq(descriptions.userId, session?.user?.id!),
  });

  return generatedDescriptions;
}

type UpdateDescriptionRequest = {
  id: string;
  text: string;
};

export async function updateDescription(request: UpdateDescriptionRequest) {
  const session = await auth();
  if (!session) throw new Error("Unauthenticated");

  const [description] = await db
    .select({
      id: descriptions.id,
      userId: descriptions.userId,
    })
    .from(descriptions)
    .where(eq(descriptions.id, request.id));

  if (description.userId !== session.user?.id) {
    throw new Error("Forbidden");
  }

  await db
    .update(descriptions)
    .set({
      text: request.text,
    })
    .where(eq(descriptions.id, request.id));

  revalidatePath(`/descriptions/${request.id}`);
}
