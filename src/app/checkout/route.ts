"use server";

import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthenticated");
  }

  const { data, error } = await createCheckout(121933, 514642, {
    checkoutData: {
      email: session.user.email ?? undefined,
      custom: {
        userId: session.user.id,
      },
    },
    productOptions: {
      redirectUrl: `${process.env.ROOT_URL}/descriptions`,
    },
    checkoutOptions: {
      embed: true,
    },
  });

  if (error) {
    throw new Error("Failed to create checkout session", { cause: error });
  }

  redirect(data.data.attributes.url);
}
