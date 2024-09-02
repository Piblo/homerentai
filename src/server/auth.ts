import { Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import { db } from "./database/connection";
import { subscriptions } from "./database/schema";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  events: {
    async createUser({ user }) {
      if (!user.id) return;

      await db.insert(subscriptions).values({
        userId: user.id,
        type: "free",
      });
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export const BASE_PATH = "/api/auth";
