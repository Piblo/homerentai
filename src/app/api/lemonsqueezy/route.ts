import { NextRequest, NextResponse } from "next/server";
import { custom, z } from "zod";

import crypto from "crypto";
import { db } from "@/server/database/connection";
import { eq } from "drizzle-orm";
import { subscriptions } from "@/server/database/schema";

export async function POST(request: NextRequest) {
  const hmac = crypto.createHmac(
    "sha256",
    process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  );

  const requestText = await request.text();

  const digest = Buffer.from(hmac.update(requestText).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") || "",
    "utf8"
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature");
  }

  const body = JSON.parse(requestText);
  const { meta } = webhookRequestSchema.parse(body);

  switch (meta.event_name) {
    case "subscription_created":
    case "subscription_updated": {
      if (!meta.custom_data?.user_id) {
        throw new Error("Missing user_id in meta.custom_data");
      }

      await db
        .update(subscriptions)
        .set({
          type: "pro",
          remainingDescriptions: 50,
        })
        .where(eq(subscriptions.userId, meta.custom_data.user_id));
    }
    case "subscription_cancelled": {
      if (!meta.custom_data?.user_id) {
        throw new Error("Missing user_id in meta.custom_data");
      }

      await db
        .update(subscriptions)
        .set({
          type: "free",
          remainingDescriptions: 10,
        })
        .where(eq(subscriptions.userId, meta.custom_data.user_id));
    }
    default:
      console.log("Unhandled webhook event: ", meta.event_name);
  }

  return NextResponse.json({ status: "ok" });
}

const metaSchema = z.object({
  event_name: z.enum([
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
  ]),
  custom_data: z
    .object({
      user_id: z.string().optional(),
    })
    .optional(),
});

const webhookRequestSchema = z.object({
  meta: metaSchema,
  data: z.object({
    attributes: z.object({
      variant_id: z.number(),
      product_id: z.number(),
    }),
  }),
});
