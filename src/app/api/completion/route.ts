import { db, poolDb } from "@/server/database/connection";
import {
  descriptions,
  images as imagesTable,
  subscriptions,
} from "@/server/database/schema";
import { eq, sql } from "drizzle-orm";

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

type CompletionRequest = {
  images: string[];
  language: string;
};

export const POST = auth(async (req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const subscription = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, req.auth.user.id),
  });

  if ((subscription?.remainingDescriptions ?? 0) <= 0) {
    return NextResponse.json(
      { message: "No remaining descriptions" },
      { status: 403 }
    );
  }

  const { images } = (await req.json()) as CompletionRequest;

  if (subscription?.type === "free" && images.length > 5) {
    return NextResponse.json(
      {
        message: "You can only upload up to 5 images with the free plan",
      },
      { status: 400 }
    );
  }

  console.log("Generating description...");

  const result = await streamText({
    model: openai("gpt-4o-mini", {
      user: req.auth?.user.id,
    }),
    maxTokens: 300,
    async onFinish({ text }) {
      console.log("Description generated");
      await db
        .update(subscriptions)
        .set({
          remainingDescriptions: sql`${subscriptions.remainingDescriptions} - 1`,
        })
        .where(eq(subscriptions.userId, req.auth?.user?.id!));

      console.log("Updated remaining descriptions");

      await poolDb.transaction(async (tx) => {
        const [description] = await tx
          .insert(descriptions)
          .values({
            userId: req.auth?.user?.id!,
            text: text,
            title: text.split("**").at(1),
          })
          .returning({
            id: descriptions.id,
          });

        console.log("Description saved in DB");

        await tx.insert(imagesTable).values(
          images.map((image) => ({
            descriptionId: description.id,
            url: image,
          }))
        );

        console.log("Images saved in DB");
      });
    },
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

  return result.toDataStreamResponse();
});
