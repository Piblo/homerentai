import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import {
  getSubscription,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

import { PRO_SUBSCRIPTION_PRODUCT_ID } from "@/constants/lemonsqueezy";
import crypto from "crypto";
import { db } from "@/server/database/connection";
import { subscriptions } from "@/server/database/schema";
import { z } from "zod";

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
});

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

      if (data.data.type !== "subscriptions") {
        throw new Error("Unexpected data type");
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
        })
        .where(eq(subscriptions.userId, data.meta.custom_data.user_id));
      return NextResponse.json({ status: "ok" });
    }
    case "subscription_payment_success": {
      if (data.data.type !== "subscription-invoices") {
        throw new Error("Unexpected data type");
      }

      if (!data.meta.custom_data?.user_id) {
        throw new Error("Missing user_id in meta.custom_data");
      }

      const subscription = await getSubscription(
        data.data.attributes.subscription_id
      );

      if (!subscription.data) {
        throw new Error("Subscription not found");
      }

      if (
        subscription.data.data.attributes.product_id ===
        PRO_SUBSCRIPTION_PRODUCT_ID
      ) {
        await db
          .update(subscriptions)
          .set({
            remainingDescriptions: sql`${subscriptions.remainingDescriptions} + 50`,
          })
          .where(eq(subscriptions.userId, data.meta.custom_data.user_id));
      }

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
    "subscription_payment_success",
  ]),
  custom_data: z
    .object({
      user_id: z.string().optional(),
    })
    .optional(),
});

const subscriptionInvoiceSchema = z.object({
  type: z.literal("subscription-invoices"),
  id: z.string(),
  attributes: z.object({
    subscription_id: z.number(),
  }),
});

const subscriptionSchema = z.object({
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
});

const webhookRequestSchema = z.object({
  meta: metaSchema,
  data: z.union([subscriptionInvoiceSchema, subscriptionSchema]),
});
