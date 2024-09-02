import { eq, sql } from "drizzle-orm";

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/database/connection";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { subscriptions } from "@/server/database/schema";

type CompletionRequest = {
  images: string[];
  language: string;
};

export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, req.auth.user?.id!),
  });

  if ((subscription?.remainingDescriptions ?? 0) <= 0) {
    return NextResponse.json(
      { message: "No remaining descriptions" },
      { status: 403 }
    );
  }

  const { images } = (await req.json()) as CompletionRequest;

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    maxTokens: 300,
    messages: [
      {
        role: "system",
        content:
          "Given the following images, generate a description that will be used on a property listing on airbnb or booking.com",
      },
      {
        role: "user",
        content: images.map((image) => ({
          image: image,
          type: "image",
        })),
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Write the description in the following language: ${req.headers.get(
              "Accept-Language"
            )}`,
          },
        ],
      },
    ],
  });

  await db
    .update(subscriptions)
    .set({
      remainingDescriptions: sql`${subscriptions.remainingDescriptions} - 1`,
    })
    .where(eq(subscriptions.userId, req.auth.user?.id!));

  return result.toDataStreamResponse();
});
