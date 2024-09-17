import { NextRequest } from "next/server";
import crypto from "crypto";

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
  console.log(body);
}

type Meta = {
  event_name:
    | "subscription_created"
    | "subscription_updated"
    | "subscription_cancelled";
  custom_data?: {
    userId?: string;
  };
};
