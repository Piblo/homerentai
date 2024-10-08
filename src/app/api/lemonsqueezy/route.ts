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
  const { success, data, error } = webhookRequestSchema.safeParse(body);
  if (!success) {
    return NextResponse.json(error, { status: 400 });
  }

  switch (data.meta.event_name) {
    case "subscription_created":
    case "subscription_updated": {
      if (!data.meta.custom_data?.user_id) {
        throw new Error("Missing user_id in meta.custom_data");
      }

      if (data.data.attributes.status !== "active") {
        return NextResponse.json({
          status: "ok",
          message: "Subscription not active, webhook request ignored",
        });
      }

      await db
        .update(subscriptions)
        .set({
          type: "pro",
          remainingDescriptions: 50,
        })
        .where(eq(subscriptions.userId, data.meta.custom_data.user_id));
      return NextResponse.json({ status: "ok" });
    }
    case "subscription_cancelled": {
      if (!data.meta.custom_data?.user_id) {
        throw new Error("Missing user_id in meta.custom_data");
      }

      await db
        .update(subscriptions)
        .set({
          type: "free",
          remainingDescriptions: 10,
        })
        .where(eq(subscriptions.userId, data.meta.custom_data.user_id));
      return NextResponse.json({ status: "ok" });
    }
    default:
      console.log("Unhandled webhook event: ", data.meta.event_name);
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
    type: z.literal("subscriptions"),
    attributes: z.object({
      variant_id: z.number(),
      product_id: z.number(),
      status: z.enum([
        "on_trial",
        "active",
        "paused",
        "past_due",
        "unpaid",
        "cancelled",
        "expired",
      ]),
    }),
  }),
});
