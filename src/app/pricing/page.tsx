import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";
import Script from "next/script";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals just getting started",
    features: [
      "10 AI-generated descriptions per month",
      "Editable descriptions",
      "Up to 5 photos per description",
      "Standard support",
    ],
    cta: {
      label: "Get started",
      href: "/descriptions",
    },
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professional hosts and realtors",
    features: [
      "50 AI-generated descriptions per month",
      "Editable descriptions",
      "Up to 10 photos per description",
      "Priority support",
      "Rewrite descriptions in a different style",
      "Optional credits top up",
    ],
    cta: {
      label: "Subscribe to Pro",
      href: "/checkout",
    },
    popular: true,
  },
  {
    name: "Business",
    price: "$59",
    description: "For large teams and agencies",
    features: [
      "200 AI-generated descriptions per month",
      "Editable descriptions",
      "Up to 10 photos per description",
      "Priority support",
      "Rewrite descriptions in a different style",
      "Optional credits top up",
    ],
    cta: {
      label: "Contact Sales",
      href: "/descriptions",
    },
    popular: false,
  },
];

export default function Pricing() {
  return (
    <main className="flex-1 py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8">
          Select the perfect plan to elevate your property listings
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.popular ? "border-primary" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={plan.cta.href}>{plan.cta.label}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="lazyOnload"
      />
    </main>
  );
}
